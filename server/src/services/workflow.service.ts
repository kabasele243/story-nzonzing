import { mastra } from '../../../storyteller/src/mastra';
import {
  SummaryInput,
  SummaryOutput,
  StorymakerInput,
  StorymakerOutput,
} from '../types';
import { AppError } from '../middleware';
import { logger } from '../utils/logger';

export class WorkflowService {
  async generateSummary(input: SummaryInput): Promise<SummaryOutput> {
    logger.info('Generating story construction menu', {
      desiredLength: input.desiredLength,
      coreIdea: input.coreIdea.substring(0, 50) + '...'
    });

    const workflow = mastra.getWorkflow('summaryWorkflow');
    if (!workflow) {
      throw new AppError('Summary workflow not found', 500);
    }

    const run = await workflow.createRunAsync();
    const result = await run.start({ inputData: input });

    if (result.status !== 'success' || !result.result) {
      throw new AppError('Failed to generate story construction menu', 500);
    }

    return result.result as SummaryOutput;
  }

  async generateStory(input: StorymakerInput): Promise<StorymakerOutput> {
    logger.info('Generating complete story', {
      protagonist: input.userSelections.protagonist,
      conflict: input.userSelections.conflict,
      stage: input.userSelections.stage,
      soul: input.userSelections.soul,
    });

    const workflow = mastra.getWorkflow('storymakerWorkflow');
    if (!workflow) {
      throw new AppError('Storymaker workflow not found', 500);
    }

    const run = await workflow.createRunAsync();
    const result = await run.start({ inputData: input });

    if (result.status !== 'success' || !result.result) {
      throw new AppError('Failed to generate story', 500);
    }

    return result.result as StorymakerOutput;
  }
}

export const workflowService = new WorkflowService();
