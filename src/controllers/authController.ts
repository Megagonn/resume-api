import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.ts';
import { Company } from '../models/Company.ts';
import { AuthRequest } from '../middleware/auth.ts';
import { publicUser, signToken } from '../utils/auth.ts';

export async function signup(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email, password, name, role, phone, companyName } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      name,
      role,
      phone,
      seekerProfile: role === 'seeker' ? {} : undefined,
    });

    if (role === 'hirer') {
      await Company.create({
        hirerId: user._id,
        name: companyName || `${name}'s Company`,
        subscription: {
          plan: 'free',
          status: 'active',
          startedAt: new Date(),
        },
      });
    }

    const token = signToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function login(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = signToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    res.json({ token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
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
