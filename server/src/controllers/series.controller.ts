import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { workflowService } from '../services/workflow.service';
import { createSupabaseClient } from '../services/supabase.service';
import { DatabaseService } from '../services/database.service';
import { ResponseUtil } from '../utils/response';

export class SeriesController {
  async createSeries(req: AuthenticatedRequest, res: Response) {
    const { storySummary, numberOfEpisodes } = req.body;
    const userId = req.userId;

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
      // Run workflow
      const seriesContext = await workflowService.createSeries({
        storySummary,
        numberOfEpisodes,
      });

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
        output: seriesContext,
        completed_at: new Date().toISOString(),
      });

      return ResponseUtil.success(res, {
        seriesContext,
        seriesId: series.id,
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

  async writeEpisode(req: AuthenticatedRequest, res: Response) {
    const { seriesId, seriesContext, episodeNumber, duration = '10', previousEpisodes } = req.body;
    const userId = req.userId;

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
      // Run workflow
      const result = await workflowService.writeEpisode({
        seriesContext,
        episodeNumber,
        duration,
        previousEpisodes,
      });

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
          const episodeScenesData = result.scenesWithPrompts.map((scene, index) => {
            // Extract multi-angle prompts from imagePrompts array
            const imagePrompts = scene.imagePrompts || [];
            return {
              scene_number: scene.sceneNumber || index + 1,
              description: scene.description || '',
              main_prompt:
                imagePrompts.find((p) => p.angle === 'main' || p.type === 'main')?.prompt || '',
              close_up_prompt:
                imagePrompts.find((p) => p.angle === 'close-up' || p.type === 'close-up')?.prompt ||
                '',
              wide_shot_prompt:
                imagePrompts.find((p) => p.angle === 'wide-shot' || p.type === 'wide-shot')
                  ?.prompt || '',
              over_shoulder_prompt:
                imagePrompts.find((p) => p.angle === 'over-shoulder' || p.type === 'over-shoulder')
                  ?.prompt || '',
              dutch_angle_prompt:
                imagePrompts.find((p) => p.angle === 'dutch-angle' || p.type === 'dutch-angle')
                  ?.prompt || '',
              birds_eye_prompt:
                imagePrompts.find((p) => p.angle === 'birds-eye' || p.type === 'birds-eye')
                  ?.prompt || '',
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

      return ResponseUtil.success(res, {
        ...result,
        episodeId,
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

  async getMySeries(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const { supabase } = await createSupabaseClient(req);
    const dbService = new DatabaseService(supabase, userId);

    const series = await dbService.getUserSeries();
    return ResponseUtil.success(res, series);
  }

  async getSeries(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const { seriesId } = req.params;
    const { supabase } = await createSupabaseClient(req);
    const dbService = new DatabaseService(supabase, userId);

    const series = await dbService.getSeries(seriesId);
    const episodes = await dbService.getSeriesEpisodes(seriesId);

    // Fetch scenes for each episode
    const episodesWithScenes = await Promise.all(
      episodes.map(async (episode) => {
        const scenes = await dbService.getEpisodeScenes(episode.id);
        return {
          ...episode,
          scenes,
        };
      })
    );

    return ResponseUtil.success(res, { series, episodes: episodesWithScenes });
  }
}

export const seriesController = new SeriesController();
