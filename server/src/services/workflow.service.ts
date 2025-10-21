import { mastra } from '../../../storyteller/src/mastra';
import {
  WorkflowResult,
  StoryExpanderInput,
  StoryExpanderOutput,
  SceneGeneratorInput,
  SceneGeneratorOutput,
  StoryToScenesInput,
  StoryToScenesOutput,
  CreateSeriesInput,
  CreateSeriesOutput,
  WriteEpisodeInput,
  WriteEpisodeOutput,
  SummaryInput,
  SummaryOutput,
  StorymakerInput,
  StorymakerOutput,
} from '../types';
import { AppError } from '../middleware';
import { logger } from '../utils/logger';

export class WorkflowService {
  async expandStory(input: StoryExpanderInput): Promise<StoryExpanderOutput> {
    logger.info('Expanding story', { duration: input.duration });

    const workflow = mastra.getWorkflow('storyExpanderWorkflow');
    if (!workflow) {
      throw new AppError('Story expander workflow not found', 500);
    }

    const run = await workflow.createRunAsync();
    const result = await run.start({ inputData: input });

    if (result.status !== 'success' || !result.result) {
      throw new AppError('Failed to expand story', 500);
    }

    return result.result as StoryExpanderOutput;
  }

  async generateScenes(input: SceneGeneratorInput): Promise<SceneGeneratorOutput> {
    logger.info('Generating scenes from story');

    const workflow = mastra.getWorkflow('sceneGeneratorWorkflow');
    if (!workflow) {
      throw new AppError('Scene generator workflow not found', 500);
    }

    const run = await workflow.createRunAsync();
    const result = await run.start({ inputData: input });

    if (result.status !== 'success' || !result.result) {
      throw new AppError('Failed to generate scenes', 500);
    }

    return result.result as SceneGeneratorOutput;
  }

  async storyToScenes(input: StoryToScenesInput): Promise<StoryToScenesOutput> {
    logger.info('Running story-to-scenes pipeline', { duration: input.duration });

    const workflow = mastra.getWorkflow('storyToScenesWorkflow');
    if (!workflow) {
      throw new AppError('Story to scenes workflow not found', 500);
    }

    const run = await workflow.createRunAsync();
    const result = await run.start({ inputData: input });

    if (result.status !== 'success' || !result.result) {
      throw new AppError('Workflow did not return a successful result', 500);
    }

    return result.result as StoryToScenesOutput;
  }

  async createSeries(input: CreateSeriesInput): Promise<CreateSeriesOutput> {
    logger.info('Creating series', { numberOfEpisodes: input.numberOfEpisodes });

    const workflow = mastra.getWorkflow('createSeriesWorkflow');
    if (!workflow) {
      throw new AppError('Create series workflow not found', 500);
    }

    const run = await workflow.createRunAsync();
    const result = await run.start({ inputData: input });

    if (result.status !== 'success' || !result.result) {
      throw new AppError('Workflow did not return a successful result', 500);
    }

    return result.result as CreateSeriesOutput;
  }

  async writeEpisode(input: WriteEpisodeInput): Promise<WriteEpisodeOutput> {
    logger.info('Writing episode', {
      episodeNumber: input.episodeNumber,
      duration: input.duration,
    });

    const workflow = mastra.getWorkflow('writeEpisodeWorkflow');
    if (!workflow) {
      throw new AppError('Write episode workflow not found', 500);
    }

    const run = await workflow.createRunAsync();
    const result = await run.start({
      inputData: {
        ...input,
        previousEpisodes: input.previousEpisodes || [],
      },
    });

    if (result.status !== 'success' || !result.result) {
      throw new AppError('Workflow did not return a successful result', 500);
    }

    return result.result as WriteEpisodeOutput;
  }

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
