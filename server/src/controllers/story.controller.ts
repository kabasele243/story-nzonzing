import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { workflowService } from '../services/workflow.service';
import { createSupabaseClient } from '../services/supabase.service';
import { DatabaseService } from '../services/database.service';
import { ResponseUtil } from '../utils/response';
import { logger } from '../utils/logger';

export class StoryController {
  async expandStory(req: AuthenticatedRequest, res: Response) {
    const { storySummary, duration = '10' } = req.body;

    const result = await workflowService.expandStory({ storySummary, duration });
    return ResponseUtil.success(res, result);
  }

  async generateScenes(req: AuthenticatedRequest, res: Response) {
    const { fullStory } = req.body;

    const result = await workflowService.generateScenes({ fullStory });
    return ResponseUtil.success(res, result);
  }

  async storyToScenes(req: AuthenticatedRequest, res: Response) {
    const { storySummary, duration = '10', title } = req.body;
    const userId = req.userId;

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
      // Run workflow
      const result = await workflowService.storyToScenes({ storySummary, duration });

      // Update story with workflow results
      await dbService.updateStory(story.id, {
        full_story: result.fullStory,
        characters: result.characters || [],
      });

      // Create scenes in database
      if (result.scenesWithPrompts && result.scenesWithPrompts.length > 0) {
        const scenesData = result.scenesWithPrompts.map((scene, index) => ({
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

      return ResponseUtil.success(res, {
        ...result,
        storyId: story.id,
        workflowRunId: workflowRun.id,
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
  }

  async storyToScenesStream(req: AuthenticatedRequest, res: Response) {
    const { storySummary, duration = '10' } = req.body;

    // Set up SSE (Server-Sent Events)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send initial message
    res.write(`data: ${JSON.stringify({ status: 'started', step: 'Expanding story...' })}\n\n`);

    try {
      const result = await workflowService.storyToScenes({ storySummary, duration });

      // Send final result
      res.write(`data: ${JSON.stringify({ status: 'completed', data: result })}\n\n`);
      res.end();
    } catch (error: any) {
      logger.error('Error in streaming endpoint:', error);
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }

  async getMyStories(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const { supabase } = await createSupabaseClient(req);
    const dbService = new DatabaseService(supabase, userId);

    const stories = await dbService.getUserStories();
    return ResponseUtil.success(res, stories);
  }

  async getStory(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const { storyId } = req.params;
    const { supabase } = await createSupabaseClient(req);
    const dbService = new DatabaseService(supabase, userId);

    const story = await dbService.getStory(storyId);
    const scenes = await dbService.getStoryScenes(storyId);

    return ResponseUtil.success(res, { story, scenes });
  }

  async deleteStory(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const { storyId } = req.params;
    const { supabase } = await createSupabaseClient(req);
    const dbService = new DatabaseService(supabase, userId);

    await dbService.deleteStory(storyId);
    return ResponseUtil.success(res, { message: 'Story deleted successfully' });
  }
}

export const storyController = new StoryController();
