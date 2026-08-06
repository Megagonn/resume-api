import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['seeker', 'hirer']),
  phone: z.string().optional(),
  companyName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const jobSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  type: z.enum(['full-time', 'part-time', 'contract', 'gig']),
  location: z.string().min(1),
  remote: z.boolean().optional(),
  salaryRange: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      currency: z.string().optional(),
    })
    .optional(),
  status: z.enum(['draft', 'open', 'closed']).optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export const applicationSchema = z.object({
  coverNote: z.string().optional(),
  resumeUrl: z.string().optional(),
});

export const applicationStatusSchema = z.object({
  status: z.enum(['new', 'reviewing', 'shortlisted', 'rejected', 'hired']),
  note: z.string().optional(),
});

export const orderSchema = z.object({
  packageId: z.string().min(1),
  notes: z.string().optional(),
  markPaid: z.boolean().optional(),
});

export const orderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'in_progress', 'delivered', 'cancelled']),
  deliverables: z.string().optional(),
  notes: z.string().optional(),
});

export const seekerProfileSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  seekerProfile: z
    .object({
      headline: z.string().optional(),
      bio: z.string().optional(),
      location: z.string().optional(),
      skills: z.array(z.string()).optional(),
      resumeUrl: z.string().optional(),
      experienceYears: z.number().optional(),
    })
    .optional(),
});

export const companySchema = z.object({
  name: z.string().min(2),
  logo: z.string().optional(),
  website: z.string().optional(),
  about: z.string().optional(),
  location: z.string().optional(),
});

export const packageSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  price: z.number().positive(),
  currency: z.string().optional(),
  description: z.string().min(2),
  features: z.array(z.string()),
  popular: z.boolean().optional(),
  sellaUrl: z.string().optional(),
  active: z.boolean().optional(),
});

export const adminUserPatchSchema = z.object({
  role: z.enum(['seeker', 'hirer', 'admin']).optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
});

export const hirerPlanPatchSchema = z.object({
  name: z.string().min(2).optional(),
  price: z.number().nullable().optional(),
  currency: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  maxOpenJobs: z.number().nullable().optional(),
  featuredAllowed: z.boolean().optional(),
  fullApplicantAccess: z.boolean().optional(),
  applicantPreviewLimit: z.number().int().positive().optional(),
});

export const companySubscriptionSchema = z.object({
  plan: z.enum(['free', 'premium', 'custom']),
  status: z.enum(['active', 'past_due', 'cancelled']).optional(),
  maxOpenJobs: z.number().nullable().optional(),
  featuredAllowed: z.boolean().optional(),
  fullApplicantAccess: z.boolean().optional(),
  applicantPreviewLimit: z.number().int().positive().optional(),
  notes: z.string().optional(),
  renewsAt: z.string().optional(),
});
