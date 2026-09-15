import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';

import { User } from '../models/User.ts';
import { Company } from '../models/Company.ts';
import { Job } from '../models/Job.ts';
import { Application } from '../models/Application.ts';
import { Order } from '../models/Order.ts';
import { Package } from '../models/Package.ts';
import { BlogPost } from '../models/BlogPost.ts';

const DEMO_PASSWORD = 'password';

export async function seedDemoData(adminUserId: Types.ObjectId): Promise<void> {
  const marker = await User.findOne({ email: 'ada@example.com' });
  if (marker) {
    console.log('Demo data already seeded — skipping');
    return;
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const [ada, tunde, chioma, ibrahim] = await User.create([
    {
      email: 'ada@example.com',
      passwordHash,
      role: 'seeker',
      name: 'Ada Okonkwo',
      phone: '+2348012345678',
      seekerProfile: {
        headline: 'Product Designer',
        bio: 'Designing thoughtful digital products for African markets.',
        location: 'Lagos, Nigeria',
        skills: ['Figma', 'UX Research', 'Prototyping'],
        experienceYears: 4,
        resumeUrl: 'https://example.com/ada-cv.pdf',
      },
    },
    {
      email: 'tunde@example.com',
      passwordHash,
      role: 'seeker',
      name: 'Tunde Balogun',
      seekerProfile: {
        headline: 'Full-Stack Engineer',
        bio: 'Building reliable web platforms with React and Node.',
        location: 'Abuja, Nigeria',
        skills: ['React', 'Node.js', 'TypeScript'],
        experienceYears: 6,
      },
    },
    {
      email: 'hiring@novatech.ng',
      passwordHash,
      role: 'hirer',
      name: 'Chioma Eze',
      phone: '+2348098765432',
    },
    {
      email: 'jobs@brightpath.com',
      passwordHash,
      role: 'hirer',
      name: 'Ibrahim Musa',
    },
  ]);

  const [novaTech, brightPath] = await Company.create([
    {
      hirerId: chioma._id,
      name: 'NovaTech Africa',
      website: 'https://novatech.ng',
      about: 'Building fintech infrastructure for emerging markets.',
      location: 'Lagos, Nigeria',
      subscription: {
        plan: 'premium',
        status: 'active',
        startedAt: new Date('2025-06-01'),
        renewsAt: new Date('2026-09-01'),
      },
    },
    {
      hirerId: ibrahim._id,
      name: 'BrightPath Studios',
      website: 'https://brightpath.com',
      about: 'Creative studio focused on brand and product design.',
      location: 'Remote',
      subscription: {
        plan: 'free',
        status: 'active',
        startedAt: new Date('2025-08-01'),
      },
    },
  ]);

  const [jobDesigner, jobBackend, jobBrand, jobGig, jobClosed] = await Job.create([
    {
      companyId: novaTech._id,
      hirerId: chioma._id,
      title: 'Senior Product Designer',
      description:
        'Lead end-to-end product design for our consumer banking app. Collaborate with PMs and engineers to ship delightful experiences.\n\nYou will own discovery, wireframes, high-fidelity UI, and design systems.',
      type: 'full-time',
      location: 'Lagos, Nigeria',
      remote: true,
      salaryRange: { min: 4000000, max: 6500000, currency: 'NGN' },
      status: 'open',
      featured: true,
      tags: ['Design', 'Figma', 'Fintech'],
      createdAt: new Date('2026-01-10T10:00:00.000Z'),
    },
    {
      companyId: novaTech._id,
      hirerId: chioma._id,
      title: 'Backend Engineer (Node.js)',
      description:
        'Build and scale APIs powering payments and KYC. Strong TypeScript and MongoDB experience preferred.',
      type: 'full-time',
      location: 'Lagos, Nigeria',
      remote: false,
      salaryRange: { min: 5000000, max: 8000000, currency: 'NGN' },
      status: 'open',
      featured: false,
      tags: ['Node.js', 'MongoDB', 'API'],
      createdAt: new Date('2026-02-01T09:00:00.000Z'),
    },
    {
      companyId: brightPath._id,
      hirerId: ibrahim._id,
      title: 'Brand Designer (Contract)',
      description:
        'Short-term contract to refresh visual identity for a consumer wellness brand. Portfolio required.',
      type: 'contract',
      location: 'Remote',
      remote: true,
      salaryRange: { min: 800000, max: 1200000, currency: 'NGN' },
      status: 'open',
      featured: false,
      tags: ['Brand', 'Illustration'],
      createdAt: new Date('2026-02-15T14:00:00.000Z'),
    },
    {
      companyId: brightPath._id,
      hirerId: ibrahim._id,
      title: 'Weekend Content Gig',
      description:
        'Create short-form social content for a lifestyle campaign over two weekends.',
      type: 'gig',
      location: 'Ibadan, Nigeria',
      remote: false,
      salaryRange: { min: 150000, max: 250000, currency: 'NGN' },
      status: 'closed',
      featured: false,
      tags: ['Content', 'Social'],
      createdAt: new Date('2026-03-01T08:00:00.000Z'),
    },
    {
      companyId: novaTech._id,
      hirerId: chioma._id,
      title: 'Customer Success Lead',
      description: 'Closed role — previously led onboarding for SME merchants.',
      type: 'full-time',
      location: 'Abuja, Nigeria',
      remote: false,
      status: 'closed',
      featured: false,
      tags: ['Support', 'CS'],
      createdAt: new Date('2025-11-20T08:00:00.000Z'),
    },
  ]);

  await Application.create([
    {
      jobId: jobDesigner._id,
      seekerId: ada._id,
      coverNote: 'I have led design for two fintech products and would love to join NovaTech.',
      resumeUrl: 'https://example.com/ada-cv.pdf',
      status: 'reviewing',
      timeline: [
        { status: 'new', at: new Date('2026-01-12T10:00:00.000Z') },
        { status: 'reviewing', at: new Date('2026-01-14T11:00:00.000Z') },
      ],
      createdAt: new Date('2026-01-12T10:00:00.000Z'),
    },
    {
      jobId: jobBackend._id,
      seekerId: tunde._id,
      coverNote: 'Six years building Node APIs at scale.',
      status: 'shortlisted',
      timeline: [
        { status: 'new', at: new Date('2026-02-03T09:00:00.000Z') },
        { status: 'reviewing', at: new Date('2026-02-04T09:00:00.000Z') },
        { status: 'shortlisted', at: new Date('2026-02-06T09:00:00.000Z') },
      ],
      createdAt: new Date('2026-02-03T09:00:00.000Z'),
    },
    {
      jobId: jobBrand._id,
      seekerId: ada._id,
      coverNote: 'Brand systems are my specialty.',
      status: 'new',
      timeline: [{ status: 'new', at: new Date('2026-02-16T10:00:00.000Z') }],
      createdAt: new Date('2026-02-16T10:00:00.000Z'),
    },
  ]);

  const [standardPkg, basicPkg] = await Promise.all([
    Package.findOne({ slug: 'standard' }),
    Package.findOne({ slug: 'basic' }),
  ]);

  if (standardPkg && basicPkg) {
    await Order.create([
      {
        seekerId: ada._id,
        packageId: standardPkg._id,
        amount: standardPkg.price,
        currency: standardPkg.currency,
        status: 'in_progress',
        paymentRef: 'mock_1001',
        notes: 'Emphasize product design leadership',
        createdAt: new Date('2026-01-05T12:00:00.000Z'),
      },
      {
        seekerId: tunde._id,
        packageId: basicPkg._id,
        amount: basicPkg.price,
        currency: basicPkg.currency,
        status: 'delivered',
        paymentRef: 'mock_1002',
        deliverables: 'CV + cover letter',
        deliveryFileUrl: '/samples/sample-cv.pdf',
        deliveryFileName: 'Tunde-Balogun-CV.pdf',
        deliveredAt: new Date('2025-12-22T12:00:00.000Z'),
        createdAt: new Date('2025-12-20T12:00:00.000Z'),
      },
    ]);
  }

  const draftExists = await BlogPost.findOne({ slug: 'interview-follow-up-templates' });
  if (!draftExists) {
    await BlogPost.create({
      title: 'Draft: Interview follow-up templates',
      slug: 'interview-follow-up-templates',
      excerpt: 'Coming soon — polite, specific notes that keep you top of mind.',
      content: 'Draft content for admin review.',
      authorId: adminUserId,
      published: false,
    });
  }

  console.log('Demo data seeded');
  console.log('  Seekers: ada@example.com, tunde@example.com (password: password)');
  console.log('  Hirers: hiring@novatech.ng, jobs@brightpath.com (password: password)');
  console.log(`  Jobs: ${[jobDesigner, jobBackend, jobBrand, jobGig, jobClosed].length} created`);
}
