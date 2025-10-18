import { Request, Response } from 'express';
import { AuthenticatedRequest, WorkflowInfo } from '../types';
import { createSupabaseClient } from '../services/supabase.service';
import { DatabaseService } from '../services/database.service';
import { ResponseUtil } from '../utils/response';

export class WorkflowController {
  async getWorkflows(req: Request, res: Response) {
    const workflows: Record<string, WorkflowInfo> = {
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

    return ResponseUtil.success(res, workflows);
  }

  async getMyWorkflowRuns(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const { supabase } = await createSupabaseClient(req);
    const dbService = new DatabaseService(supabase, userId);

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const runs = await dbService.getUserWorkflowRuns(limit);

    return ResponseUtil.success(res, runs);
  }
}

export const workflowController = new WorkflowController();
