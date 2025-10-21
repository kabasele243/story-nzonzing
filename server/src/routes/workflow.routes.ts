import { Router } from 'express';
import { workflowController } from '../controllers/workflow.controller';
import { requireAuth, asyncHandler } from '../middleware';

const router = Router();

// Public endpoint - Get available workflows
router.get('/workflows',
  asyncHandler(workflowController.getWorkflows));

// Protected endpoint - Get user's workflow runs
router.get('/my-workflow-runs', requireAuth,
  asyncHandler(workflowController.getMyWorkflowRuns));

// Public endpoint - Execute summary workflow
router.post('/summary',
  asyncHandler(workflowController.executeSummary));

// Public endpoint - Execute storymaker workflow
router.post('/storymaker',
  asyncHandler(workflowController.executeStorymaker));

export default router;
