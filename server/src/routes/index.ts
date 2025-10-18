import { Router } from 'express';
import healthRoutes from './health.routes';
import workflowRoutes from './workflow.routes';
import storyRoutes from './story.routes';
import seriesRoutes from './series.routes';

const router = Router();

// Health check (no /api prefix)
router.use('/', healthRoutes);

// API routes
router.use('/api', workflowRoutes);
router.use('/api', storyRoutes);
router.use('/api', seriesRoutes);

export default router;
