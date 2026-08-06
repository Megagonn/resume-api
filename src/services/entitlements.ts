import type { PlanEntitlements, HirerPlanSlug, CompanySubscription } from '../types/index.js';
import type { ICompany } from '../models/Company.js';
import { Job } from '../models/Job.js';
import { HirerPlan } from '../models/HirerPlan.js';

export const DEFAULT_PLAN_ENTITLEMENTS: Record<HirerPlanSlug, PlanEntitlements> = {
  free: {
    maxOpenJobs: 1,
    featuredAllowed: false,
    fullApplicantAccess: false,
    applicantPreviewLimit: 5,
  },
  premium: {
    maxOpenJobs: null,
    featuredAllowed: true,
    fullApplicantAccess: true,
    applicantPreviewLimit: 5,
  },
  custom: {
    maxOpenJobs: null,
    featuredAllowed: true,
    fullApplicantAccess: true,
    applicantPreviewLimit: 5,
  },
};

export function resolveEntitlements(
  subscription: CompanySubscription | undefined | null
): PlanEntitlements {
  const plan = subscription?.plan || 'free';
  const defaults = DEFAULT_PLAN_ENTITLEMENTS[plan];

  if (plan === 'custom' && subscription) {
    return {
      maxOpenJobs:
        subscription.maxOpenJobs !== undefined ? subscription.maxOpenJobs : defaults.maxOpenJobs,
      featuredAllowed:
        subscription.featuredAllowed !== undefined
          ? subscription.featuredAllowed
          : defaults.featuredAllowed,
      fullApplicantAccess:
        subscription.fullApplicantAccess !== undefined
          ? subscription.fullApplicantAccess
          : defaults.fullApplicantAccess,
      applicantPreviewLimit:
        subscription.applicantPreviewLimit !== undefined
          ? subscription.applicantPreviewLimit
          : defaults.applicantPreviewLimit,
    };
  }

  return { ...defaults };
}

export async function countOpenJobs(hirerId: string, excludeJobId?: string): Promise<number> {
  const filter: Record<string, unknown> = { hirerId, status: 'open' };
  if (excludeJobId) filter._id = { $ne: excludeJobId };
  return Job.countDocuments(filter);
}

export class PlanLimitError extends Error {
  code = 'PLAN_LIMIT' as const;
  status = 403;

  constructor(message: string) {
    super(message);
    this.name = 'PlanLimitError';
  }
}

export async function assertCanOpenJob(company: ICompany, excludeJobId?: string): Promise<void> {
  const entitlements = resolveEntitlements(company.subscription);
  if (entitlements.maxOpenJobs === null) return;

  const openCount = await countOpenJobs(company.hirerId.toString(), excludeJobId);
  if (openCount >= entitlements.maxOpenJobs) {
    throw new PlanLimitError(
      `Your ${company.subscription?.plan || 'free'} plan allows ${entitlements.maxOpenJobs} open job${
        entitlements.maxOpenJobs === 1 ? '' : 's'
      }. Upgrade to Premium for unlimited openings.`
    );
  }
}

export async function assertCanFeature(company: ICompany, featured: boolean): Promise<void> {
  if (!featured) return;
  const entitlements = resolveEntitlements(company.subscription);
  if (!entitlements.featuredAllowed) {
    throw new PlanLimitError(
      'Featured listings are available on Premium and Custom plans. Upgrade to feature this job.'
    );
  }
}

export function redactApplicationsForPlan<T extends Record<string, unknown>>(
  applications: T[],
  entitlements: PlanEntitlements
): { applications: T[]; previewCapped: boolean; totalCount: number } {
  const totalCount = applications.length;
  if (entitlements.fullApplicantAccess) {
    return { applications, previewCapped: false, totalCount };
  }

  const limited = applications.slice(0, entitlements.applicantPreviewLimit).map((app) => {
    const clone = { ...app } as T & {
      resumeUrl?: string;
      seekerId?: Record<string, unknown> | string;
    };
    delete clone.resumeUrl;

    if (clone.seekerId && typeof clone.seekerId === 'object') {
      const seeker = { ...clone.seekerId };
      delete seeker.phone;
      if (seeker.seekerProfile && typeof seeker.seekerProfile === 'object') {
        const profile = { ...(seeker.seekerProfile as Record<string, unknown>) };
        delete profile.resumeUrl;
        seeker.seekerProfile = profile;
      }
      clone.seekerId = seeker;
    }

    return clone as T;
  });

  return {
    applications: limited,
    previewCapped: true,
    totalCount,
  };
}

export async function getPlanDefaultsFromDb(slug: HirerPlanSlug): Promise<PlanEntitlements> {
  const plan = await HirerPlan.findOne({ slug });
  if (!plan) return DEFAULT_PLAN_ENTITLEMENTS[slug];
  return {
    maxOpenJobs: plan.maxOpenJobs,
    featuredAllowed: plan.featuredAllowed,
    fullApplicantAccess: plan.fullApplicantAccess,
    applicantPreviewLimit: plan.applicantPreviewLimit,
  };
}
