import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response';

export function validateDuration(req: Request, res: Response, next: NextFunction) {
  const { duration } = req.body;

  if (duration && !['5', '10', '30'].includes(duration)) {
    return ResponseUtil.badRequest(res, 'duration must be "5", "10", or "30"');
  }

  next();
}

export function validateRequired(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing = fields.filter((field) => !req.body[field]);

    if (missing.length > 0) {
      return ResponseUtil.badRequest(
        res,
        `Missing required fields: ${missing.join(', ')}`
      );
    }

    next();
  };
}

export function validatePositiveNumber(field: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.body[field];

    if (value !== undefined && (typeof value !== 'number' || value < 1)) {
      return ResponseUtil.badRequest(res, `${field} must be a positive number`);
    }

    next();
  };
}
