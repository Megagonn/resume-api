import { Request, Response, NextFunction } from 'express';
import { PlanLimitError } from '../services/entitlements.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err);

  if (err instanceof PlanLimitError) {
    res.status(err.status).json({ code: err.code, message: err.message });
    return;
  }

  if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 11000) {
    res.status(409).json({ message: 'Resource already exists' });
    return;
  }

  const message = err instanceof Error ? err.message : 'Internal server error';
  res.status(500).json({ message });
}
