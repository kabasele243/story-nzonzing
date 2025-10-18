import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';
import { env } from '../config';
import { ResponseUtil } from '../utils/response';
import { logger } from '../utils/logger';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    logger.warn('Authentication failed: No token provided');
    return ResponseUtil.unauthorized(res, 'No token provided');
  }

  try {
    const verified = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
    });

    // Attach user info to request
    (req as any).userId = verified.sub;
    (req as any).user = verified;

    logger.debug(`User authenticated: ${verified.sub}`);
    next();
  } catch (error) {
    logger.error('Authentication failed: Invalid token', error);
    return ResponseUtil.unauthorized(res, 'Invalid token');
  }
}
