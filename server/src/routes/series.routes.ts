import { Router } from 'express';
import { seriesController } from '../controllers/series.controller';
import {
  requireAuth,
  asyncHandler,
  validateRequired,
  validatePositiveNumber,
  validateDuration,
} from '../middleware';

const router = Router();

// Create series
router.post(
  '/create-series',
  requireAuth,
  validateRequired(['storySummary', 'numberOfEpisodes']),
  validatePositiveNumber('numberOfEpisodes'),
  asyncHandler(seriesController.createSeries)
);

// Write episode
router.post(
  '/write-episode',
  requireAuth,
  validateRequired(['seriesContext', 'episodeNumber']),
  validatePositiveNumber('episodeNumber'),
  validateDuration,
  asyncHandler(seriesController.writeEpisode)
);

// Get user's series
router.get('/my-series',
  requireAuth,
  asyncHandler(seriesController.getMySeries));

// Get specific series with episodes
router.get('/series/:seriesId',
  requireAuth,
  asyncHandler(seriesController.getSeries));

export default router;
