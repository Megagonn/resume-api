import jwt from 'jsonwebtoken';
import { env } from '../config/env.ts';
import type { JwtPayload, UserRole } from '../types/index.ts';

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function publicUser(user: {
  _id: { toString(): string };
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  avatarUrl?: string;
  seekerProfile?: unknown;
  createdAt?: Date;
}) {
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    seekerProfile: user.seekerProfile,
    createdAt: user.createdAt,
  };
}
