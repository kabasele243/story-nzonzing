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

export default router;
