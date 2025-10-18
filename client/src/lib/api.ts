// API integration layer for Story Pipeline backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface StoryExpanderInput {
  storySummary: string;
  duration?: '5' | '10' | '30';
}

export interface StoryExpanderOutput {
  fullStory: string;
}

export interface Character {
  name: string;
  description: string;
  keyTraits: string;
}

export interface SceneWithPrompt {
  sceneNumber: number;
  description: string;
  setting: string;
  charactersPresent: string[];
  imagePrompt: string;
}

export interface SceneGeneratorInput {
  fullStory: string;
}

export interface SceneGeneratorOutput {
  scenesWithPrompts: SceneWithPrompt[];
}

export interface CompletePipelineInput {
  storySummary: string;
  duration?: '5' | '10' | '30';
}

export interface CompletePipelineOutput {
  fullStory: string;
  characters: Character[];
  scenesWithPrompts: SceneWithPrompt[];
  storyId?: string; // Database ID of the saved story
}

// Story Expander API
export async function expandStory(input: StoryExpanderInput): Promise<StoryExpanderOutput> {
  const response = await fetch(`${API_BASE_URL}/expand-story`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to expand story');
  }

  const result = await response.json();
  const workflowData = result.data;

  // Extract from workflow steps structure
  const fullStory = workflowData.steps?.['expand-story']?.output?.fullStory || '';

  return { fullStory };
}

// Scene Generator API
export async function generateScenes(input: SceneGeneratorInput): Promise<SceneGeneratorOutput> {
  const response = await fetch(`${API_BASE_URL}/generate-scenes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate scenes');
  }

  const result = await response.json();
  const workflowData = result.data;

  // Extract from workflow steps structure
  const scenesWithPrompts = workflowData.steps?.['generate-prompts']?.output?.scenesWithPrompts || [];

  return { scenesWithPrompts };
}

// Complete Pipeline API - WITH AUTHENTICATION
export async function runCompletePipeline(
  input: CompletePipelineInput,
  authToken: string
): Promise<CompletePipelineOutput> {
  const response = await fetch(`${API_BASE_URL}/story-to-scenes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to run complete pipeline');
  }

  const result = await response.json();

  // Return the full data including storyId
  return {
    fullStory: result.data.fullStory || '',
    characters: result.data.characters || [],
    scenesWithPrompts: result.data.scenesWithPrompts || [],
    storyId: result.data.storyId,
  };
}

// Health check
export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch('http://localhost:3000/health');
  return response.json();
}

// ===== SERIES WORKFLOWS =====

export interface MasterCharacter {
  name: string;
  description: string;
  keyTraits: string;
  visualAnchorPrompt: string;
  role: string;
}

export interface EpisodeOutline {
  episodeNumber: number;
  title: string;
  synopsis: string;
  keyEvents: string[];
  charactersInvolved: string[];
}

export interface PlotThread {
  name: string;
  description: string;
  startsInEpisode: number;
  resolvesInEpisode?: number;
}

export interface SeriesContext {
  seriesTitle: string;
  seriesDescription: string;
  tagline: string;
  themes: string[];
  masterCharacters: MasterCharacter[];
  episodeOutlines: EpisodeOutline[];
  plotThreads: PlotThread[];
  totalEpisodes: number;
}

export interface CreateSeriesInput {
  storySummary: string;
  numberOfEpisodes: number;
}

export interface CreateSeriesOutput {
  seriesContext: SeriesContext;
}

export interface PreviousEpisodeSummary {
  episodeNumber: number;
  title: string;
  summary: string;
}

export interface ImagePrompt {
  type: 'main' | 'close-up' | 'wide-shot' | 'over-shoulder' | 'dutch-angle' | 'birds-eye';
  prompt: string;
  description: string;
}

export interface SceneWithMultiAnglePrompts {
  sceneNumber: number;
  description: string;
  setting: string;
  charactersPresent: string[];
  imagePrompts: ImagePrompt[];
}

export interface WriteEpisodeInput {
  seriesContext: SeriesContext;
  episodeNumber: number;
  duration?: '5' | '10' | '30';
  previousEpisodes?: PreviousEpisodeSummary[];
}

export interface WriteEpisodeOutput {
  seriesTitle: string;
  episodeNumber: number;
  episodeTitle: string;
  fullEpisode: string;
  scenesWithPrompts: SceneWithMultiAnglePrompts[];
}

// Create Series API - WITH AUTHENTICATION
export async function createSeries(
  input: CreateSeriesInput,
  authToken: string
): Promise<CreateSeriesOutput & { seriesId?: string }> {
  const response = await fetch(`${API_BASE_URL}/create-series`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create series');
  }

  const result = await response.json();

  // Return the series context and seriesId from the API response
  return {
    seriesContext: result.data.seriesContext,
    seriesId: result.data.seriesId,
  };
}

// Write Episode API - WITH AUTHENTICATION
export async function writeEpisode(
  input: WriteEpisodeInput & { seriesId?: string },
  authToken: string
): Promise<WriteEpisodeOutput & { episodeId?: string }> {
  const response = await fetch(`${API_BASE_URL}/write-episode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to write episode');
  }

  const result = await response.json();

  // Return the episode data including episodeId
  return {
    seriesTitle: result.data.seriesTitle || '',
    episodeNumber: result.data.episodeNumber || 0,
    episodeTitle: result.data.episodeTitle || '',
    fullEpisode: result.data.fullEpisode || '',
    scenesWithPrompts: result.data.scenesWithPrompts || [],
    episodeId: result.data.episodeId,
  };
}

// ===== DATABASE FETCH OPERATIONS =====

// Database representation of series (matches Supabase schema)
export interface SeriesRecord {
  id: string;
  user_id?: string;
  clerk_user_id: string;
  title: string;
  summary: string;
  number_of_episodes: number;
  characters?: unknown[];
  episode_outlines?: unknown[];
  plot_threads?: unknown[];
  created_at: string;
  updated_at: string;
}

// Extended series with both database and context properties
export interface SeriesWithId extends SeriesRecord, SeriesContext {}

export interface EpisodeWithId extends WriteEpisodeOutput {
  id: string;
  series_id: string;
  clerk_user_id: string;
  episode_number: number;
  created_at: string;
  updated_at: string;
}

export interface SeriesWithEpisodes {
  series: SeriesWithId;
  episodes: EpisodeWithId[];
}

// Helper function to transform database series to include SeriesContext properties
function transformSeries(dbSeries: SeriesRecord): SeriesWithId {
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
function transformEpisode(dbEpisode: any, seriesTitle: string): EpisodeWithId {
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

// Fetch all user's series - WITH AUTHENTICATION
export async function fetchUserSeries(authToken: string): Promise<SeriesWithId[]> {
  const response = await fetch(`${API_BASE_URL}/my-series`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch series');
  }

  const result = await response.json();
  const seriesRecords = result.data as SeriesRecord[];
  return seriesRecords.map(transformSeries);
}

// Fetch a specific series with its episodes - WITH AUTHENTICATION
export async function fetchSeriesWithEpisodes(
  seriesId: string,
  authToken: string
): Promise<SeriesWithEpisodes> {
  const response = await fetch(`${API_BASE_URL}/series/${seriesId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch series');
  }

  const result = await response.json();
  const data = result.data;

  const transformedSeries = transformSeries(data.series as SeriesRecord);

  return {
    series: transformedSeries,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    episodes: data.episodes.map((ep: any) => transformEpisode(ep, transformedSeries.seriesTitle)),
  };
}
