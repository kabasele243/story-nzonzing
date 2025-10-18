import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response';

export function validateExpandStoryRequest(req: Request, res: Response, next: NextFunction) {
  const { storySummary, duration } = req.body;

  if (!storySummary || typeof storySummary !== 'string' || storySummary.trim().length === 0) {
    return ResponseUtil.badRequest(res, 'storySummary is required and must be a non-empty string');
  }

  if (duration && !['5', '10', '30'].includes(duration)) {
    return ResponseUtil.badRequest(res, 'duration must be "5", "10", or "30"');
  }

  next();
}

export function validateGenerateScenesRequest(req: Request, res: Response, next: NextFunction) {
  const { fullStory } = req.body;

  if (!fullStory || typeof fullStory !== 'string' || fullStory.trim().length === 0) {
    return ResponseUtil.badRequest(res, 'fullStory is required and must be a non-empty string');
  }

  next();
}

export function validateStoryToScenesRequest(req: Request, res: Response, next: NextFunction) {
  const { storySummary, duration, title } = req.body;

  if (!storySummary || typeof storySummary !== 'string' || storySummary.trim().length === 0) {
    return ResponseUtil.badRequest(res, 'storySummary is required and must be a non-empty string');
  }

  if (duration && !['5', '10', '30'].includes(duration)) {
    return ResponseUtil.badRequest(res, 'duration must be "5", "10", or "30"');
  }

  if (title && typeof title !== 'string') {
    return ResponseUtil.badRequest(res, 'title must be a string');
  }

  next();
}
