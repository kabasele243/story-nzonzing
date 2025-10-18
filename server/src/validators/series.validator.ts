import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response';

export function validateCreateSeriesRequest(req: Request, res: Response, next: NextFunction) {
  const { storySummary, numberOfEpisodes } = req.body;

  if (!storySummary || typeof storySummary !== 'string' || storySummary.trim().length === 0) {
    return ResponseUtil.badRequest(res, 'storySummary is required and must be a non-empty string');
  }

  if (!numberOfEpisodes || typeof numberOfEpisodes !== 'number' || numberOfEpisodes < 1) {
    return ResponseUtil.badRequest(
      res,
      'numberOfEpisodes is required and must be a positive number'
    );
  }

  next();
}

export function validateWriteEpisodeRequest(req: Request, res: Response, next: NextFunction) {
  const { seriesContext, episodeNumber, duration } = req.body;

  if (!seriesContext || typeof seriesContext !== 'object') {
    return ResponseUtil.badRequest(res, 'seriesContext is required and must be an object');
  }

  if (!episodeNumber || typeof episodeNumber !== 'number' || episodeNumber < 1) {
    return ResponseUtil.badRequest(
      res,
      'episodeNumber is required and must be a positive number'
    );
  }

  if (duration && !['5', '10', '30'].includes(duration)) {
    return ResponseUtil.badRequest(res, 'duration must be "5", "10", or "30"');
  }

  next();
}
