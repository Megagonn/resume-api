import type { Response, NextFunction } from 'express';

import { Application } from '../models/Application.ts';
import { Job } from '../models/Job.ts';
import type { AuthRequest } from '../middleware/auth.ts';
import { uploadBuffer } from '../services/cloudinary.ts';

export async function applyToJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.status !== 'open') {
      res.status(404).json({ message: 'Job not available' });
      return;
    }

    const existing = await Application.findOne({
      jobId: job._id,
      seekerId: req.user!.id,
    });
    if (existing) {
      res.status(409).json({ message: 'Already applied to this job' });
      return;
    }

    let resumeUrl = req.body.resumeUrl as string | undefined;
    if (req.file) {
      const uploaded = await uploadBuffer(req.file.buffer, {
        folder: 'ready-brand/applications',
        resourceType: 'raw',
        filename: req.file.originalname,
      });
      resumeUrl = uploaded.url;
    }

    const application = await Application.create({
      jobId: job._id,
      seekerId: req.user!.id,
      coverNote: req.body.coverNote,
      resumeUrl,
      status: 'new',
      timeline: [{ status: 'new', at: new Date() }],
    });

    res.status(201).json({ application });
  } catch (err) {
    next(err);
  }
}

export async function listSeekerApplications(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const applications = await Application.find({ seekerId: req.user!.id })
      .populate({
        path: 'jobId',
        populate: { path: 'companyId', select: 'name logo location' },
      })
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    next(err);
  }
}

export async function updateApplicationStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const application = await Application.findById(req.params.id).populate('jobId');
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    const job = application.jobId as unknown as { hirerId: { toString(): string } };
    if (job.hirerId.toString() !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ message: 'Not allowed' });
      return;
    }

    application.status = req.body.status;
    application.timeline.push({
      status: req.body.status,
      at: new Date(),
      note: req.body.note,
    });
    await application.save();

    res.json({ application });
  } catch (err) {
    next(err);
  }
}
