import type { Response, NextFunction } from 'express';

import { Company } from '../models/Company.ts';
import { HirerPlan } from '../models/HirerPlan.ts';
import { Job } from '../models/Job.ts';
import type { AuthRequest } from '../middleware/auth.ts';
import { countOpenJobs, resolveEntitlements } from '../services/entitlements.ts';
import type { HirerPlanSlug } from '../types/index.ts';

export async function listHirerPlans(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const plans = await HirerPlan.find({ active: true }).sort({ price: 1 });
    res.json({ plans });
  } catch (err) {
    next(err);
  }
}

export async function getSubscription(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const company = await Company.findOne({ hirerId: req.user!.id });
    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    const entitlements = resolveEntitlements(company.subscription);
    const openJobs = await countOpenJobs(req.user!.id);
    const planDoc = await HirerPlan.findOne({ slug: company.subscription.plan });

    res.json({
      company,
      subscription: company.subscription,
      entitlements,
      usage: { openJobs },
      plan: planDoc,
    });
  } catch (err) {
    next(err);
  }
}

export async function upgradeSubscription(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const company = await Company.findOne({ hirerId: req.user!.id });
    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    if (company.subscription.plan === 'custom') {
      res.status(400).json({
        message: 'Custom plans are managed by admin. Contact support to change your plan.',
      });
      return;
    }

    const now = new Date();
    const renewsAt = new Date(now);
    renewsAt.setMonth(renewsAt.getMonth() + 1);

    company.subscription = {
      plan: 'premium',
      status: 'active',
      startedAt: now,
      renewsAt,
      notes: company.subscription.notes,
    };
    await company.save();

    const entitlements = resolveEntitlements(company.subscription);
    const openJobs = await countOpenJobs(req.user!.id);
    const planDoc = await HirerPlan.findOne({ slug: 'premium' });

    res.json({
      company,
      subscription: company.subscription,
      entitlements,
      usage: { openJobs },
      plan: planDoc,
      message: 'Upgraded to Premium (mock payment)',
    });
  } catch (err) {
    next(err);
  }
}

export async function listAdminHirerPlans(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const plans = await HirerPlan.find().sort({ price: 1 });
    res.json({ plans });
  } catch (err) {
    next(err);
  }
}

export async function updateAdminHirerPlan(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const plan = await HirerPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) {
      res.status(404).json({ message: 'Plan not found' });
      return;
    }
    res.json({ plan });
  } catch (err) {
    next(err);
  }
}

export async function listAdminCompanies(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const companies = await Company.find()
      .populate('hirerId', 'name email')
      .sort({ createdAt: -1 });

    const withUsage = await Promise.all(
      companies.map(async (company) => {
        const openJobs = await Job.countDocuments({ hirerId: company.hirerId, status: 'open' });
        return {
          ...company.toObject(),
          entitlements: resolveEntitlements(company.subscription),
          usage: { openJobs },
        };
      })
    );

    res.json({ companies: withUsage });
  } catch (err) {
    next(err);
  }
}

export async function updateCompanySubscription(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    const plan = (req.body.plan || company.subscription.plan) as HirerPlanSlug;
    const now = new Date();

    company.subscription = {
      plan,
      status: req.body.status || company.subscription.status || 'active',
      startedAt: company.subscription.startedAt || now,
      renewsAt: req.body.renewsAt ? new Date(req.body.renewsAt) : company.subscription.renewsAt,
      notes: req.body.notes !== undefined ? req.body.notes : company.subscription.notes,
      ...(plan === 'custom'
        ? {
            maxOpenJobs: req.body.maxOpenJobs,
            featuredAllowed: req.body.featuredAllowed,
            fullApplicantAccess: req.body.fullApplicantAccess,
            applicantPreviewLimit: req.body.applicantPreviewLimit,
          }
        : {}),
    };
    company.markModified('subscription');

    // Clear featured flags if plan no longer allows them
    const entitlements = resolveEntitlements(company.subscription);
    if (!entitlements.featuredAllowed) {
      await Job.updateMany({ hirerId: company.hirerId, featured: true }, { featured: false });
    }

    await company.save();

    const openJobs = await countOpenJobs(company.hirerId.toString());
    res.json({
      company,
      entitlements,
      usage: { openJobs },
    });
  } catch (err) {
    next(err);
  }
}
