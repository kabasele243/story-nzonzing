import { Router } from 'express';
import { storyController } from '../controllers/story.controller';
import {
  requireAuth,
  asyncHandler,
  validateRequired,
  validateDuration,
} from '../middleware';

const router = Router();

// Story expansion endpoint (no auth for backward compatibility)
router.post(
  '/expand-story',
  validateRequired(['storySummary']),
  validateDuration,
  asyncHandler(storyController.expandStory)
);

// Scene generation endpoint (no auth for backward compatibility)
router.post('/generate-scenes',
  validateRequired(['fullStory']),
  asyncHandler(storyController.generateScenes));

// Complete pipeline with database persistence
router.post(
  '/story-to-scenes',
  requireAuth,
  validateRequired(['storySummary']),
  validateDuration,
  asyncHandler(storyController.storyToScenes)
);

// Streaming endpoint
router.post(
  '/story-to-scenes/stream',
  validateRequired(['storySummary']),
  validateDuration,
  asyncHandler(storyController.storyToScenesStream)
);

// Get user's stories
router.get('/my-stories',
  requireAuth,
  asyncHandler(storyController.getMyStories));

// Get specific story with scenes
router.get('/stories/:storyId',
  requireAuth,
  asyncHandler(storyController.getStory));

// Delete story
router.delete('/stories/:storyId',
  requireAuth,
  asyncHandler(storyController.deleteStory));

export default router;
