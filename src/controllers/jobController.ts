import { Response, NextFunction } from 'express';
import { Job } from '../models/Job.js';
import { Company } from '../models/Company.js';
import { Application } from '../models/Application.js';
import { AuthRequest } from '../middleware/auth.js';
import {
  assertCanFeature,
  assertCanOpenJob,
  resolveEntitlements,
  redactApplicationsForPlan,
} from '../services/entitlements.js';

export async function listJobs(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { type, location, remote, q, status } = req.query;
    const filter: Record<string, unknown> = { status: status || 'open' };

    if (type) filter.type = type;
    if (location) filter.location = new RegExp(String(location), 'i');
    if (remote === 'true') filter.remote = true;
    if (remote === 'false') filter.remote = false;
    if (q) filter.$text = { $search: String(q) };

    const jobs = await Job.find(filter)
      .populate('companyId', 'name logo location website')
      .sort({ featured: -1, createdAt: -1 });

    res.json({ jobs });
  } catch (err) {
    next(err);
  }
}

export async function getJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const job = await Job.findById(req.params.id).populate(
      'companyId',
      'name logo location website about'
    );
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    res.json({ job });
  } catch (err) {
    next(err);
  }
}

export async function createJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const company = await Company.findOne({ hirerId: req.user!.id });
    if (!company) {
      res.status(400).json({ message: 'Create a company profile first' });
      return;
    }

    const status = req.body.status || 'open';
    const featured = Boolean(req.body.featured);

    if (status === 'open') {
      await assertCanOpenJob(company);
    }
    await assertCanFeature(company, featured);

    const job = await Job.create({
      ...req.body,
      companyId: company._id,
      hirerId: req.user!.id,
      status,
      featured,
      tags: req.body.tags || [],
      remote: req.body.remote ?? false,
    });

    res.status(201).json({ job });
  } catch (err) {
    next(err);
  }
}

export async function updateJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const job = await Job.findOne({ _id: req.params.id, hirerId: req.user!.id });
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    const company = await Company.findOne({ hirerId: req.user!.id });
    if (!company) {
      res.status(400).json({ message: 'Company profile required' });
      return;
    }

    const nextStatus = req.body.status ?? job.status;
    const nextFeatured =
      req.body.featured !== undefined ? Boolean(req.body.featured) : job.featured;

    if (nextStatus === 'open' && job.status !== 'open') {
      await assertCanOpenJob(company, job._id.toString());
    }
    await assertCanFeature(company, nextFeatured);

    Object.assign(job, req.body);
    job.featured = nextFeatured;
    await job.save();
    res.json({ job });
  } catch (err) {
    next(err);
  }
}

export async function deleteJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, hirerId: req.user!.id });
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    await Application.deleteMany({ jobId: job._id });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
}

export async function listHirerJobs(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const jobs = await Job.find({ hirerId: req.user!.id }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    next(err);
  }
}

export async function listJobApplications(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const job = await Job.findOne({ _id: req.params.id, hirerId: req.user!.id });
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    const company = await Company.findOne({ hirerId: req.user!.id });
    const entitlements = resolveEntitlements(company?.subscription);

    const applications = await Application.find({ jobId: job._id })
      .populate('seekerId', 'name email phone seekerProfile avatarUrl')
      .sort({ createdAt: -1 })
      .lean();

    const result = redactApplicationsForPlan(
      applications as unknown as Record<string, unknown>[],
      entitlements
    );

    res.json({
      applications: result.applications,
      previewCapped: result.previewCapped,
      totalCount: result.totalCount,
      entitlements,
    });
  } catch (err) {
    next(err);
  }
}
