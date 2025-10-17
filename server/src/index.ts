import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { mastra } from '../../storyteller/src/mastra';
import { createSupabaseClient, requireAuth } from './lib/supabase';
import { DatabaseService } from './services/database';

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
    createSeries: {
      id: 'create-series-workflow',
      description: 'Creates series metadata, characters, episode outlines, and plot threads',
      input: { storySummary: 'string', numberOfEpisodes: 'number' },
      output: { seriesContext: 'object with full series information' },
    },
    writeEpisode: {
      id: 'write-episode-workflow',
      description: 'Writes a single episode with scenes and multi-angle image prompts',
      input: {
        seriesContext: 'object',
        episodeNumber: 'number',
        duration: 'string (5, 10, or 30)',
        previousEpisodes: 'array (optional)',
      },
      output: { fullEpisode: 'string', scenesWithPrompts: 'array' },
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

// 3. Complete Pipeline Endpoint (Story Summary → Scenes) - With Database Persistence
app.post('/api/story-to-scenes', requireAuth, async (req: Request, res: Response) => {
  try {
    const { storySummary, duration = '10', title } = req.body;
    const userId = (req as any).userId;

    if (!storySummary) {
      return res.status(400).json({
        error: 'storySummary is required',
        example: { storySummary: 'A brief story summary (200 words)...', duration: '10', title: 'My Story' },
      });
    }

    // Validate duration
    if (duration && !['5', '10', '30'].includes(duration)) {
      return res.status(400).json({
        error: 'duration must be "5", "10", or "30"',
      });
    }

    // Create database service
    const { supabase } = await createSupabaseClient(req);
    const dbService = new DatabaseService(supabase, userId);

    // Create initial story record
    const story = await dbService.createStory({
      summary: storySummary,
      title,
      duration: parseInt(duration),
    });

    // Create workflow run record
    const workflowRun = await dbService.createWorkflowRun({
      workflow_id: 'story-to-scenes-workflow',
      workflow_name: 'Story to Scenes',
      status: 'running',
      input: { storySummary, duration },
    });

    try {
      const workflow = mastra.getWorkflow('storyToScenesWorkflow');
      if (!workflow) {
        await dbService.updateWorkflowRun(workflowRun.id, {
          status: 'failed',
          error: 'Workflow not found',
          completed_at: new Date().toISOString(),
        });
        return res.status(500).json({ error: 'Story to scenes workflow not found' });
      }

      const run = await workflow.createRunAsync();
      const workflowResult = await run.start({
        inputData: { storySummary, duration },
      });

      // Extract the actual result data
      const result = workflowResult.status === 'success' ? workflowResult.result : null;

      if (!result) {
        throw new Error('Workflow did not return a successful result');
      }

      // Update story with workflow results
      await dbService.updateStory(story.id, {
        full_story: result.fullStory,
        characters: result.characters || [],
      });

      // Create scenes in database
      if (result.scenesWithPrompts && result.scenesWithPrompts.length > 0) {
        const scenesData = result.scenesWithPrompts.map((scene: any, index: number) => ({
          scene_number: index + 1,
          description: scene.description || '',
          image_prompt: scene.imagePrompt || '',
          location: scene.location || '',
          characters: scene.characters || [],
        }));
        await dbService.createScenes(story.id, scenesData);
      }

      // Update workflow run as completed
      await dbService.updateWorkflowRun(workflowRun.id, {
        status: 'completed',
        output: result,
        completed_at: new Date().toISOString(),
      });

      res.json({
        success: true,
        data: {
          ...result,
          storyId: story.id,
          workflowRunId: workflowRun.id,
        },
      });
    } catch (workflowError: any) {
      // Update workflow run as failed
      await dbService.updateWorkflowRun(workflowRun.id, {
        status: 'failed',
        error: workflowError.message,
        completed_at: new Date().toISOString(),
      });
      throw workflowError;
    }
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

// 5. Create Series Endpoint - With Database Persistence
app.post('/api/create-series', requireAuth, async (req: Request, res: Response) => {
  try {
    const { storySummary, numberOfEpisodes } = req.body;
    const userId = (req as any).userId;

    if (!storySummary) {
      return res.status(400).json({
        error: 'storySummary is required',
        example: { storySummary: 'A story summary...', numberOfEpisodes: 5 },
      });
    }

    if (!numberOfEpisodes || numberOfEpisodes < 1) {
      return res.status(400).json({
        error: 'numberOfEpisodes is required and must be at least 1',
      });
    }

    // Create database service
    const { supabase } = await createSupabaseClient(req);
    const dbService = new DatabaseService(supabase, userId);

    // Create workflow run record
    const workflowRun = await dbService.createWorkflowRun({
      workflow_id: 'create-series-workflow',
      workflow_name: 'Create Series',
      status: 'running',
      input: { storySummary, numberOfEpisodes },
    });

    try {
      const workflow = mastra.getWorkflow('createSeriesWorkflow');
      if (!workflow) {
        await dbService.updateWorkflowRun(workflowRun.id, {
          status: 'failed',
          error: 'Workflow not found',
          completed_at: new Date().toISOString(),
        });
        return res.status(500).json({ error: 'Create series workflow not found' });
      }

      const run = await workflow.createRunAsync();
      const workflowResult = await run.start({
        inputData: { storySummary, numberOfEpisodes },
      });

      // Extract the actual result data
      const result = workflowResult.status === 'success' ? workflowResult.result : null;

      if (!result) {
        throw new Error('Workflow did not return a successful result');
      }

      // The result itself is the series context
      const seriesContext = result;

      // Create series record in database
      const series = await dbService.createSeries({
        title: seriesContext.seriesTitle || 'Untitled Series',
        summary: storySummary,
        number_of_episodes: numberOfEpisodes,
        characters: seriesContext.masterCharacters || [],
        episode_outlines: seriesContext.episodeOutlines || [],
        plot_threads: seriesContext.plotThreads || [],
      });

      // Update workflow run as completed
      await dbService.updateWorkflowRun(workflowRun.id, {
        status: 'completed',
        output: result,
        completed_at: new Date().toISOString(),
      });

      res.json({
        success: true,
        data: {
          seriesContext: result,
          seriesId: series.id,
          workflowRunId: workflowRun.id,
        },
      });
    } catch (workflowError: any) {
      // Update workflow run as failed
      await dbService.updateWorkflowRun(workflowRun.id, {
        status: 'failed',
        error: workflowError.message,
        completed_at: new Date().toISOString(),
      });
      throw workflowError;
    }
  } catch (error: any) {
    console.error('Error creating series:', error);
    res.status(500).json({
      error: 'Failed to create series',
      message: error.message,
    });
  }
});

// 6. Write Episode Endpoint - With Database Persistence
app.post('/api/write-episode', requireAuth, async (req: Request, res: Response) => {
  try {
    const { seriesId, seriesContext, episodeNumber, duration = '10', previousEpisodes } = req.body;
    const userId = (req as any).userId;

    if (!seriesContext) {
      return res.status(400).json({
        error: 'seriesContext is required',
        example: {
          seriesId: 'uuid',
          seriesContext: { /* series context object */ },
          episodeNumber: 1,
          duration: '10',
          previousEpisodes: [],
        },
      });
    }

    if (!episodeNumber || episodeNumber < 1) {
      return res.status(400).json({
        error: 'episodeNumber is required and must be at least 1',
      });
    }

    // Validate duration
    if (duration && !['5', '10', '30'].includes(duration)) {
      return res.status(400).json({
        error: 'duration must be "5", "10", or "30"',
      });
    }

    // Create database service
    const { supabase } = await createSupabaseClient(req);
    const dbService = new DatabaseService(supabase, userId);

    // Create workflow run record
    const workflowRun = await dbService.createWorkflowRun({
      workflow_id: 'write-episode-workflow',
      workflow_name: 'Write Episode',
      status: 'running',
      input: { seriesContext, episodeNumber, duration },
    });

    try {
      const workflow = mastra.getWorkflow('writeEpisodeWorkflow');
      if (!workflow) {
        await dbService.updateWorkflowRun(workflowRun.id, {
          status: 'failed',
          error: 'Workflow not found',
          completed_at: new Date().toISOString(),
        });
        return res.status(500).json({ error: 'Write episode workflow not found' });
      }

      const run = await workflow.createRunAsync();
      const workflowResult = await run.start({
        inputData: {
          seriesContext,
          episodeNumber,
          duration,
          previousEpisodes: previousEpisodes || [],
        },
      });

      // Extract the actual result data
      const result = workflowResult.status === 'success' ? workflowResult.result : null;

      if (!result) {
        throw new Error('Workflow did not return a successful result');
      }

      // Create episode record in database (if seriesId provided)
      let episodeId = null;
      if (seriesId) {
        const episode = await dbService.createEpisode({
          series_id: seriesId,
          episode_number: episodeNumber,
          title: result.episodeTitle || `Episode ${episodeNumber}`,
          full_episode: result.fullEpisode || '',
          duration: parseInt(duration),
        });

        episodeId = episode.id;

        // Create episode scenes in database
        if (result.scenesWithPrompts && result.scenesWithPrompts.length > 0) {
          const episodeScenesData = result.scenesWithPrompts.map((scene: any, index: number) => {
            // Extract multi-angle prompts from imagePrompts array
            const imagePrompts = scene.imagePrompts || [];
            return {
              scene_number: scene.sceneNumber || index + 1,
              description: scene.description || '',
              main_prompt: imagePrompts.find((p: any) => p.angle === 'main')?.prompt || '',
              close_up_prompt: imagePrompts.find((p: any) => p.angle === 'close-up')?.prompt || '',
              wide_shot_prompt: imagePrompts.find((p: any) => p.angle === 'wide-shot')?.prompt || '',
              over_shoulder_prompt: imagePrompts.find((p: any) => p.angle === 'over-shoulder')?.prompt || '',
              dutch_angle_prompt: imagePrompts.find((p: any) => p.angle === 'dutch-angle')?.prompt || '',
              birds_eye_prompt: imagePrompts.find((p: any) => p.angle === 'birds-eye')?.prompt || '',
            };
          });
          await dbService.createEpisodeScenes(episode.id, episodeScenesData);
        }
      }

      // Update workflow run as completed
      await dbService.updateWorkflowRun(workflowRun.id, {
        status: 'completed',
        output: result,
        completed_at: new Date().toISOString(),
      });

      res.json({
        success: true,
        data: {
          ...result,
          episodeId,
          workflowRunId: workflowRun.id,
        },
      });
    } catch (workflowError: any) {
      // Update workflow run as failed
      await dbService.updateWorkflowRun(workflowRun.id, {
        status: 'failed',
        error: workflowError.message,
        completed_at: new Date().toISOString(),
      });
      throw workflowError;
    }
  } catch (error: any) {
    console.error('Error writing episode:', error);
    res.status(500).json({
      error: 'Failed to write episode',
      message: error.message,
    });
  }
});

// ========== Data Retrieval Endpoints ==========

// Get user's stories
app.get('/api/my-stories', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { supabase } = await createSupabaseClient(req);
    const dbService = new DatabaseService(supabase, userId);

    const stories = await dbService.getUserStories();

    res.json({
      success: true,
      data: stories,
    });
  } catch (error: any) {
    console.error('Error fetching stories:', error);
    res.status(500).json({
      error: 'Failed to fetch stories',
      message: error.message,
    });
  }
});

// Get a specific story with scenes
app.get('/api/stories/:storyId', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { storyId } = req.params;
    const { supabase } = await createSupabaseClient(req);
    const dbService = new DatabaseService(supabase, userId);

    const story = await dbService.getStory(storyId);
    const scenes = await dbService.getStoryScenes(storyId);

    res.json({
      success: true,
      data: {
        story,
        scenes,
      },
    });
  } catch (error: any) {
    console.error('Error fetching story:', error);
    res.status(500).json({
      error: 'Failed to fetch story',
      message: error.message,
    });
  }
});

// Get user's series
app.get('/api/my-series', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { supabase } = await createSupabaseClient(req);
    const dbService = new DatabaseService(supabase, userId);

    const series = await dbService.getUserSeries();

    res.json({
      success: true,
      data: series,
    });
  } catch (error: any) {
    console.error('Error fetching series:', error);
    res.status(500).json({
      error: 'Failed to fetch series',
      message: error.message,
    });
  }
});

// Get a specific series with episodes
app.get('/api/series/:seriesId', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { seriesId } = req.params;
    const { supabase } = await createSupabaseClient(req);
    const dbService = new DatabaseService(supabase, userId);

    const series = await dbService.getSeries(seriesId);
    const episodes = await dbService.getSeriesEpisodes(seriesId);

    res.json({
      success: true,
      data: {
        series,
        episodes,
      },
    });
  } catch (error: any) {
    console.error('Error fetching series:', error);
    res.status(500).json({
      error: 'Failed to fetch series',
      message: error.message,
    });
  }
});

// Get user's workflow runs
app.get('/api/my-workflow-runs', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { supabase } = await createSupabaseClient(req);
    const dbService = new DatabaseService(supabase, userId);

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const runs = await dbService.getUserWorkflowRuns(limit);

    res.json({
      success: true,
      data: runs,
    });
  } catch (error: any) {
    console.error('Error fetching workflow runs:', error);
    res.status(500).json({
      error: 'Failed to fetch workflow runs',
      message: error.message,
    });
  }
});

// Delete a story
app.delete('/api/stories/:storyId', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { storyId } = req.params;
    const { supabase } = await createSupabaseClient(req);
    const dbService = new DatabaseService(supabase, userId);

    await dbService.deleteStory(storyId);

    res.json({
      success: true,
      message: 'Story deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting story:', error);
    res.status(500).json({
      error: 'Failed to delete story',
      message: error.message,
    });
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
});

export default app;
