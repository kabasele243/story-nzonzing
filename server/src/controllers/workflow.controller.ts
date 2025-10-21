import { Request, Response } from 'express';
import { AuthenticatedRequest, WorkflowInfo } from '../types';
import { createSupabaseClient } from '../services/supabase.service';
import { DatabaseService } from '../services/database.service';
import { ResponseUtil } from '../utils/response';
import { workflowService } from '../services/workflow.service';

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
      summary: {
        id: 'summary-workflow',
        description: 'Generates a structured menu of story choices using the Storyteller\'s Compass framework',
        input: {
          desiredLength: 'string (e.g., 3, 5, 10, 40 minutes)',
          coreIdea: 'string (brief story summary)',
        },
        output: {
          userInputAnalysis: 'object',
          storyConstructionMenu: 'array of story categories with options'
        },
      },
      storymaker: {
        id: 'storymaker-workflow',
        description: 'Generates a complete story based on user selections from the story construction menu',
        input: {
          userSelections: 'object with protagonist, conflict, stage, soul option IDs',
          storyConstructionMenu: 'array of story categories with options',
          userInputAnalysis: 'object with original user input and analysis'
        },
        output: {
          metadata: 'object with title, generation info, and blueprint reference',
          storyContent: 'string with complete story text'
        },
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

  async executeSummary(req: Request, res: Response) {
    const { desiredLength, coreIdea } = req.body;

    if (!desiredLength || !coreIdea) {
      return ResponseUtil.error(res, 'desiredLength and coreIdea are required', 400);
    }

    try {
      const result = await workflowService.generateSummary({
        desiredLength,
        coreIdea,
      });

      return ResponseUtil.success(res, result);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message, 500);
    }
  }

  async executeStorymaker(req: Request, res: Response) {
    const { userSelections, storyConstructionMenu, userInputAnalysis } = req.body;

    if (!userSelections || !storyConstructionMenu || !userInputAnalysis) {
      return ResponseUtil.error(res, 'userSelections, storyConstructionMenu, and userInputAnalysis are required', 400);
    }

    if (!userSelections.protagonist || !userSelections.conflict || !userSelections.stage || !userSelections.soul) {
      return ResponseUtil.error(res, 'All userSelections (protagonist, conflict, stage, soul) are required', 400);
    }

    try {
      const result = await workflowService.generateStory({
        userSelections,
        storyConstructionMenu,
        userInputAnalysis,
      });

      return ResponseUtil.success(res, result);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message, 500);
    }
  }
}

export const workflowController = new WorkflowController();
