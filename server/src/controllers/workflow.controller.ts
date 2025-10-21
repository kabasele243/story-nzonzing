import { Request, Response } from 'express';
import { AuthenticatedRequest, WorkflowInfo } from '../types';
import { createSupabaseClient } from '../services/supabase.service';
import { DatabaseService } from '../services/database.service';
import { ResponseUtil } from '../utils/response';
import { workflowService } from '../services/workflow.service';

export class WorkflowController {
  async getWorkflows(req: Request, res: Response) {
    const workflows: Record<string, WorkflowInfo> = {
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
