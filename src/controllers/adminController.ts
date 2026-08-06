import type { Response, NextFunction } from 'express';

import { User } from '../models/User.ts';
import { Job } from '../models/Job.ts';
import { Application } from '../models/Application.ts';
import { Order } from '../models/Order.ts';
import { Package } from '../models/Package.ts';
import { Company } from '../models/Company.ts';
import type { AuthRequest } from '../middleware/auth.ts';
import { publicUser } from '../utils/auth.ts';

export async function getStats(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [users, jobs, applications, orders, packages, openJobs, pendingOrders] =
      await Promise.all([
        User.countDocuments({ role: { $ne: 'admin' } }),
        Job.countDocuments(),
        Application.countDocuments(),
        Order.countDocuments(),
        Package.countDocuments({ active: true }),
        Job.countDocuments({ status: 'open' }),
        Order.countDocuments({ status: { $in: ['pending', 'paid', 'in_progress'] } }),
      ]);

    const seekers = await User.countDocuments({ role: 'seeker' });
    const hirers = await User.countDocuments({ role: 'hirer' });
    const [subscriptionsFree, subscriptionsPremium, subscriptionsCustom] = await Promise.all([
      Company.countDocuments({ 'subscription.plan': 'free' }),
      Company.countDocuments({ 'subscription.plan': 'premium' }),
      Company.countDocuments({ 'subscription.plan': 'custom' }),
    ]);

    res.json({
      stats: {
        users,
        seekers,
        hirers,
        jobs,
        openJobs,
        applications,
        orders,
        pendingOrders,
        packages,
        subscriptionsFree,
        subscriptionsPremium,
        subscriptionsCustom,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users: users.map(publicUser) });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (req.body.role) user.role = req.body.role;
    if (req.body.name) user.name = req.body.name;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    await user.save();
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function listAllJobs(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const jobs = await Job.find()
      .populate('companyId', 'name')
      .populate('hirerId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    next(err);
  }
}

export async function listAllApplications(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const applications = await Application.find()
      .populate('jobId', 'title')
      .populate('seekerId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) {
    next(err);
  }
}

export async function listAllOrders(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const orders = await Order.find()
      .populate('packageId')
      .populate('seekerId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

export async function listAdminPackages(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const packages = await Package.find().sort({ price: 1 });
    res.json({ packages });
  } catch (err) {
    next(err);
  }
}

export async function createPackage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ package: pkg });
  } catch (err) {
    next(err);
  }
}

export async function updatePackage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pkg) {
      res.status(404).json({ message: 'Package not found' });
      return;
    }
    res.json({ package: pkg });
  } catch (err) {
    next(err);
  }
}

export async function deletePackage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!pkg) {
      res.status(404).json({ message: 'Package not found' });
      return;
    }
    res.json({ package: pkg, message: 'Package deactivated' });
  } catch (err) {
    next(err);
  }
}
