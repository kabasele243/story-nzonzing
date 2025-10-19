import type {
  SeriesRecord,
  SeriesWithId,
  EpisodeWithId
} from '../types/database.types';
import type {
  MasterCharacter,
  EpisodeOutline,
  PlotThread,
  SceneWithMultiAnglePrompts,
  ImagePrompt
} from '../types/series.types';

// Helper function to transform database series to include SeriesContext properties
export function transformSeries(dbSeries: SeriesRecord): SeriesWithId {
  return {
    ...dbSeries,
    seriesTitle: dbSeries.title,
    seriesDescription: dbSeries.summary,
    tagline: '', // Not stored in database yet
    themes: [], // Not stored in database yet
    masterCharacters: (dbSeries.characters as MasterCharacter[]) || [],
    episodeOutlines: (dbSeries.episode_outlines as EpisodeOutline[]) || [],
    plotThreads: (dbSeries.plot_threads as PlotThread[]) || [],
    totalEpisodes: dbSeries.number_of_episodes,
  };
}

// Helper function to transform database episode to include WriteEpisodeOutput properties
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformEpisode(dbEpisode: any, seriesTitle: string): EpisodeWithId {
  // Transform episode scenes to multi-angle prompts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scenesWithPrompts: SceneWithMultiAnglePrompts[] = (dbEpisode.scenes || []).map((scene: any) => ({
    sceneNumber: scene.scene_number,
    description: scene.description,
    setting: '', // Not stored separately in database
    charactersPresent: [], // Not stored in database
    imagePrompts: [
      { type: 'main', prompt: scene.main_prompt || '', description: 'Main shot' },
      { type: 'close-up', prompt: scene.close_up_prompt || '', description: 'Close-up shot' },
      { type: 'wide-shot', prompt: scene.wide_shot_prompt || '', description: 'Wide shot' },
      { type: 'over-shoulder', prompt: scene.over_shoulder_prompt || '', description: 'Over-shoulder shot' },
      { type: 'dutch-angle', prompt: scene.dutch_angle_prompt || '', description: 'Dutch angle shot' },
      { type: 'birds-eye', prompt: scene.birds_eye_prompt || '', description: 'Birds eye shot' },
    ].filter(p => p.prompt) as ImagePrompt[],
  }));

  return {
    id: dbEpisode.id,
    series_id: dbEpisode.series_id,
    clerk_user_id: dbEpisode.clerk_user_id,
    episode_number: dbEpisode.episode_number,
    created_at: dbEpisode.created_at,
    updated_at: dbEpisode.updated_at,
    // WriteEpisodeOutput properties
    seriesTitle: seriesTitle,
    episodeNumber: dbEpisode.episode_number,
    episodeTitle: dbEpisode.title,
    fullEpisode: dbEpisode.full_episode,
    scenesWithPrompts,
  };
}
