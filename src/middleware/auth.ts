import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.ts';
import type { AuthRequestUser, JwtPayload, UserRole } from '../types/index.ts';

export interface AuthRequest extends Request {
  user?: AuthRequestUser;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
    req.user = { id: payload.userId, role: payload.role, email: payload.email };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }
    next();
  };
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const token = header.slice(7);
      const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
      req.user = { id: payload.userId, role: payload.role, email: payload.email };
    } catch {
      // ignore invalid token for optional auth
    }
  }
  next();
}
