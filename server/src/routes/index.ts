import { Router } from 'express';
import healthRoutes from './health.routes';
import workflowRoutes from './workflow.routes';

const router = Router();

// Health check (no /api prefix)
router.use('/', healthRoutes);

// API routes
router.use('/api', workflowRoutes);

export default router;
