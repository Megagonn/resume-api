import { Response, NextFunction } from 'express';
import { User } from '../models/User.ts';
import { Company } from '../models/Company.ts';
import { AuthRequest } from '../middleware/auth.ts';
import { publicUser } from '../utils/auth.ts';

export async function getSeekerProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function updateSeekerProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.avatarUrl !== undefined) user.avatarUrl = req.body.avatarUrl;
    if (req.body.seekerProfile) {
      user.seekerProfile = { ...user.seekerProfile, ...req.body.seekerProfile };
    }
    await user.save();

    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function getHirerAccount(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const company = await Company.findOne({ hirerId: req.user!.id });
    res.json({ user: publicUser(user), company });
  } catch (err) {
    next(err);
  }
}

export async function updateHirerAccount(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.avatarUrl !== undefined) user.avatarUrl = req.body.avatarUrl;
    await user.save();

    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function getCompany(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const company = await Company.findOne({ hirerId: req.user!.id });
    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }
    res.json({ company });
  } catch (err) {
    next(err);
  }
}

export async function updateCompany(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    let company = await Company.findOne({ hirerId: req.user!.id });
    if (!company) {
      company = await Company.create({
        ...req.body,
        hirerId: req.user!.id,
        subscription: {
          plan: 'free',
          status: 'active',
          startedAt: new Date(),
        },
      });
    } else {
      const { subscription: _ignored, ...safe } = req.body;
      Object.assign(company, safe);
      await company.save();
    }
    res.json({ company });
  } catch (err) {
    next(err);
  }
}
