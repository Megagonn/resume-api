export type UserRole = 'seeker' | 'hirer' | 'admin';

export type JobType = 'full-time' | 'part-time' | 'contract' | 'gig';

export type JobStatus = 'draft' | 'open' | 'closed';

export type ApplicationStatus =
  | 'new'
  | 'reviewing'
  | 'shortlisted'
  | 'rejected'
  | 'hired';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'in_progress'
  | 'delivered'
  | 'cancelled';

export type HirerPlanSlug = 'free' | 'premium' | 'custom';

export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled';

export interface PlanEntitlements {
  maxOpenJobs: number | null;
  featuredAllowed: boolean;
  fullApplicantAccess: boolean;
  applicantPreviewLimit: number;
}

export interface CompanySubscription {
  plan: HirerPlanSlug;
  status: SubscriptionStatus;
  maxOpenJobs?: number | null;
  featuredAllowed?: boolean;
  fullApplicantAccess?: boolean;
  applicantPreviewLimit?: number;
  notes?: string;
  startedAt: Date;
  renewsAt?: Date;
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
}

export interface AuthRequestUser {
  id: string;
  role: UserRole;
  email: string;
}
