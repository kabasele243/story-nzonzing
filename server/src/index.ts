import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { mastra } from '../../storyteller/src/mastra';

const app = express();
const PORT = process.env.PORT || 3000;

// Verify API key is loaded
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.error('❌ ERROR: GOOGLE_GENERATIVE_AI_API_KEY not found in environment variables');
  console.error('Please create a .env file in the server directory with:');
  console.error('GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Story Pipeline Server is running' });
});

// Get all available workflows
app.get('/api/workflows', (req: Request, res: Response) => {
  const workflows = {
    storyExpander: {
      id: 'story-expander-workflow',
      description: 'Expands a short story summary into a full narrative',
      input: { storySummary: 'string', duration: 'string (5, 10, or 30 minutes, default: 10)' },
      output: { fullStory: 'string' },
    },
    sceneGenerator: {
      id: 'scene-generator-workflow',
      description: 'Generates scene breakdowns and image prompts from a full story',
      input: { fullStory: 'string' },
      output: { scenesWithPrompts: 'array' },
    },
    storyToScenes: {
      id: 'story-to-scenes-workflow',
      description: 'Complete pipeline: summary → full story → scene prompts',
      input: { storySummary: 'string', duration: 'string (5, 10, or 30 minutes, default: 10)' },
      output: { fullStory: 'string', characters: 'array', scenesWithPrompts: 'array' },
    },
  };

  res.json(workflows);
});

// 1. Expand Story Endpoint
app.post('/api/expand-story', async (req: Request, res: Response) => {
  try {
    const { storySummary, duration = '10' } = req.body;

    if (!storySummary) {
      return res.status(400).json({
        error: 'storySummary is required',
        example: { storySummary: 'A detective discovers a conspiracy...', duration: '10' },
      });
    }

    // Validate duration
    if (duration && !['5', '10', '30'].includes(duration)) {
      return res.status(400).json({
        error: 'duration must be "5", "10", or "30"',
      });
    }

    const workflow = mastra.getWorkflow('storyExpanderWorkflow');
    if (!workflow) {
      return res.status(500).json({ error: 'Story expander workflow not found' });
    }

    const run = await workflow.createRunAsync();
    const result = await run.start({
      inputData: { storySummary, duration },
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error expanding story:', error);
    res.status(500).json({
      error: 'Failed to expand story',
      message: error.message,
    });
  }
});

// 2. Generate Scenes Endpoint
app.post('/api/generate-scenes', async (req: Request, res: Response) => {
  try {
    const { fullStory } = req.body;

    if (!fullStory) {
      return res.status(400).json({
        error: 'fullStory is required',
        example: { fullStory: 'Complete story text here...' },
      });
    }

    const workflow = mastra.getWorkflow('sceneGeneratorWorkflow');
    if (!workflow) {
      return res.status(500).json({ error: 'Scene generator workflow not found' });
    }

    const run = await workflow.createRunAsync();
    const result = await run.start({
      inputData: { fullStory },
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error generating scenes:', error);
    res.status(500).json({
      error: 'Failed to generate scenes',
      message: error.message,
    });
  }
});

// 3. Complete Pipeline Endpoint (Story Summary → Scenes)
app.post('/api/story-to-scenes', async (req: Request, res: Response) => {
  try {
    const { storySummary, duration = '10' } = req.body;

    if (!storySummary) {
      return res.status(400).json({
        error: 'storySummary is required',
        example: { storySummary: 'A brief story summary (200 words)...', duration: '10' },
      });
    }

    // Validate duration
    if (duration && !['5', '10', '30'].includes(duration)) {
      return res.status(400).json({
        error: 'duration must be "5", "10", or "30"',
      });
    }

    const workflow = mastra.getWorkflow('storyToScenesWorkflow');
    if (!workflow) {
      return res.status(500).json({ error: 'Story to scenes workflow not found' });
    }

    const run = await workflow.createRunAsync();
    const result = await run.start({
      inputData: { storySummary, duration },
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error in story-to-scenes pipeline:', error);
    res.status(500).json({
      error: 'Failed to process story pipeline',
      message: error.message,
    });
  }
});

// 4. Stream endpoint for real-time updates (optional enhancement)
app.post('/api/story-to-scenes/stream', async (req: Request, res: Response) => {
  try {
    const { storySummary, duration = '10' } = req.body;

    if (!storySummary) {
      return res.status(400).json({
        error: 'storySummary is required',
      });
    }

    // Validate duration
    if (duration && !['5', '10', '30'].includes(duration)) {
      return res.status(400).json({
        error: 'duration must be "5", "10", or "30"',
      });
    }

    // Set up SSE (Server-Sent Events)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const workflow = mastra.getWorkflow('storyToScenesWorkflow');
    if (!workflow) {
      res.write(`data: ${JSON.stringify({ error: 'Workflow not found' })}\n\n`);
      return res.end();
    }

    // Send initial message
    res.write(`data: ${JSON.stringify({ status: 'started', step: 'Expanding story...' })}\n\n`);

    const run = await workflow.createRunAsync();
    const result = await run.start({
      inputData: { storySummary, duration },
    });

    // Send final result
    res.write(`data: ${JSON.stringify({ status: 'completed', data: result })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Error in streaming endpoint:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Story Pipeline Server running on http://localhost:${PORT}`);
  console.log(`📖 API Documentation:`);
  console.log(`   GET  /health - Health check`);
  console.log(`   GET  /api/workflows - List available workflows`);
  console.log(`   POST /api/expand-story - Expand story summary`);
  console.log(`   POST /api/generate-scenes - Generate scenes from full story`);
  console.log(`   POST /api/story-to-scenes - Complete pipeline (summary → scenes)`);
  console.log(`   POST /api/story-to-scenes/stream - Streaming pipeline`);
});

export default app;
