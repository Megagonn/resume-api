import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Package } from '../models/Package.js';
import { HirerPlan } from '../models/HirerPlan.js';
import { Company } from '../models/Company.js';
import { env } from '../config/env.js';

const defaultPackages = [
  {
    slug: 'basic',
    name: 'Basic Package',
    price: 15000,
    currency: 'NGN',
    description: 'Perfect for entry-level professionals',
    features: [
      'Professional CV Rewrite',
      'ATS-Optimized Format',
      'Basic Cover Letter',
      '2 Revisions',
      '48-Hour Delivery',
    ],
    popular: false,
    sellaUrl: 'https://sella.com.ng/hannah_cvwriter/basic-cv-package',
    active: true,
  },
  {
    slug: 'standard',
    name: 'Standard Package',
    price: 25000,
    currency: 'NGN',
    description: 'For mid-level professionals seeking growth',
    features: [
      'Premium CV Rewrite',
      'ATS-Optimized Format',
      'Customized Cover Letter',
      'LinkedIn Profile Optimization',
      'Unlimited Revisions',
      '24-Hour Delivery',
      'Email Support',
    ],
    popular: true,
    sellaUrl: 'https://sella.com.ng/hannah_cvwriter/standard-cv-package',
    active: true,
  },
  {
    slug: 'premium',
    name: 'Premium Package',
    price: 40000,
    currency: 'NGN',
    description: 'Complete career package for executives',
    features: [
      'Executive CV Rewrite',
      'ATS-Optimized Format',
      'Multiple Cover Letters (3)',
      'LinkedIn Profile Optimization',
      'Resume Website',
      'Unlimited Revisions',
      '12-Hour Express Delivery',
      'Priority Support',
      '1-on-1 Consultation',
    ],
    popular: false,
    sellaUrl: 'https://sella.com.ng/hannah_cvwriter/premium-cv-package',
    active: true,
  },
];

const defaultHirerPlans = [
  {
    slug: 'free' as const,
    name: 'Free',
    price: 0,
    currency: 'NGN',
    description: 'Post one open role and preview applicants.',
    features: [
      '1 concurrent open job',
      'Applicant preview (first 5)',
      'Company profile page',
    ],
    active: true,
    maxOpenJobs: 1,
    featuredAllowed: false,
    fullApplicantAccess: false,
    applicantPreviewLimit: 5,
  },
  {
    slug: 'premium' as const,
    name: 'Premium',
    price: 25000,
    currency: 'NGN',
    description: 'Unlimited openings, featured listings, full applicant access.',
    features: [
      'Unlimited open jobs',
      'Featured job listings',
      'Full applicant pipeline & resumes',
      'Priority placement on the job board',
    ],
    active: true,
    maxOpenJobs: null,
    featuredAllowed: true,
    fullApplicantAccess: true,
    applicantPreviewLimit: 5,
  },
  {
    slug: 'custom' as const,
    name: 'Custom',
    price: null,
    currency: 'NGN',
    description: 'Tailored limits and pricing for high-volume employers.',
    features: [
      'Admin-configured job slots',
      'Optional featured listings',
      'Negotiated applicant access',
      'Dedicated support',
    ],
    active: true,
    maxOpenJobs: null,
    featuredAllowed: true,
    fullApplicantAccess: true,
    applicantPreviewLimit: 5,
  },
];

export async function seed(): Promise<void> {
  const admin = await User.findOne({ email: env.adminEmail.toLowerCase() });
  if (!admin) {
    const passwordHash = await bcrypt.hash(env.adminPassword, 10);
    await User.create({
      email: env.adminEmail.toLowerCase(),
      passwordHash,
      name: 'Super Admin',
      role: 'admin',
    });
    console.log(`Admin seeded: ${env.adminEmail}`);
  }

  for (const pkg of defaultPackages) {
    const exists = await Package.findOne({ slug: pkg.slug });
    if (!exists) {
      await Package.create(pkg);
    }
  }
  console.log('Packages seeded');

  for (const plan of defaultHirerPlans) {
    const exists = await HirerPlan.findOne({ slug: plan.slug });
    if (!exists) {
      await HirerPlan.create(plan);
    } else {
      await HirerPlan.updateOne({ slug: plan.slug }, { $set: plan });
    }
  }
  console.log('Hirer plans seeded');

  // Backfill Free subscription on companies missing it
  await Company.updateMany(
    { 'subscription.plan': { $exists: false } },
    {
      $set: {
        subscription: {
          plan: 'free',
          status: 'active',
          startedAt: new Date(),
        },
      },
    }
  );
}
