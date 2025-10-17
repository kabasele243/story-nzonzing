/**
 * Shared TypeScript types for Nzonzing application
 * Can be used in both client and server
 */

// ========== Database Types ==========

export interface User {
  id: string;
  clerk_user_id: string;
  email?: string;
  username?: string;
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  user_id?: string;
  clerk_user_id: string;
  title?: string;
  summary: string;
  full_story?: string;
  duration?: number; // 5, 10, or 30 minutes
  characters?: Character[];
  created_at: string;
  updated_at: string;
}

export interface Scene {
  id: string;
  story_id: string;
  clerk_user_id: string;
  scene_number: number;
  description: string;
  image_prompt?: string;
  location?: string;
  characters?: string[];
  created_at: string;
  updated_at: string;
}

export interface Series {
  id: string;
  user_id?: string;
  clerk_user_id: string;
  title: string;
  summary: string;
  number_of_episodes: number;
  characters?: Character[];
  episode_outlines?: EpisodeOutline[];
  plot_threads?: PlotThread[];
  created_at: string;
  updated_at: string;
}

export interface Episode {
  id: string;
  series_id: string;
  clerk_user_id: string;
  episode_number: number;
  title: string;
  full_episode: string;
  duration?: number;
  created_at: string;
  updated_at: string;
}

export interface EpisodeScene {
  id: string;
  episode_id: string;
  clerk_user_id: string;
  scene_number: number;
  description: string;
  main_prompt?: string;
  close_up_prompt?: string;
  wide_shot_prompt?: string;
  over_shoulder_prompt?: string;
  dutch_angle_prompt?: string;
  birds_eye_prompt?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowRun {
  id: string;
  clerk_user_id: string;
  workflow_id: string;
  workflow_name: string;
  status: WorkflowStatus;
  input?: any;
  output?: any;
  error?: string;
  started_at: string;
  completed_at?: string;
  created_at: string;
}

// ========== Workflow Types ==========

export type WorkflowStatus = 'pending' | 'running' | 'completed' | 'failed';

export type StoryDuration = '5' | '10' | '30';

export interface Character {
  name: string;
  description: string;
  keyTraits: string;
  visualAnchorPrompt: string;
}

export interface EpisodeOutline {
  episodeNumber: number;
  title: string;
  synopsis: string;
  keyEvents: string[];
}

export interface PlotThread {
  name: string;
  description: string;
  episodesSpanned: number[];
}

// ========== API Request Types ==========

export interface CreateStoryRequest {
  storySummary: string;
  duration?: StoryDuration;
  title?: string;
}

export interface CreateStoryResponse {
  success: boolean;
  data: {
    fullStory: string;
    characters: Character[];
    scenesWithPrompts: SceneWithPrompt[];
    storyId: string;
    workflowRunId: string;
  };
}

export interface SceneWithPrompt {
  sceneNumber: number;
  description: string;
  imagePrompt: string;
  location?: string;
  characters?: string[];
}

export interface CreateSeriesRequest {
  storySummary: string;
  numberOfEpisodes: number;
}

export interface CreateSeriesResponse {
  success: boolean;
  data: {
    seriesContext: SeriesContext;
  };
}

export interface SeriesContext {
  seriesTitle: string;
  masterCharacters: Character[];
  episodeOutlines: EpisodeOutline[];
  plotThreads: PlotThread[];
}

export interface WriteEpisodeRequest {
  seriesContext: SeriesContext;
  episodeNumber: number;
  duration?: StoryDuration;
  previousEpisodes?: PreviousEpisode[];
}

export interface WriteEpisodeResponse {
  success: boolean;
  data: {
    episodeTitle: string;
    fullEpisode: string;
    scenesWithMultiAnglePrompts: SceneWithMultiAnglePrompts[];
  };
}

export interface PreviousEpisode {
  episodeNumber: number;
  title: string;
  summary: string;
}

export interface SceneWithMultiAnglePrompts {
  sceneNumber: number;
  description: string;
  prompts: {
    main: string;
    closeUp: string;
    wideShot: string;
    overShoulder: string;
    dutchAngle: string;
    birdsEye: string;
  };
}

// ========== API Response Types ==========

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success?: false;
  error: string;
  message?: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// ========== Helper Types ==========

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: WorkflowStatus;
  dateFrom?: string;
  dateTo?: string;
}

// ========== Type Guards ==========

export function isApiError(response: ApiResponse): response is ApiErrorResponse {
  return !response.success || 'error' in response;
}

export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return response.success === true && 'data' in response;
}

export function isValidDuration(duration: string): duration is StoryDuration {
  return ['5', '10', '30'].includes(duration);
}

export function isValidWorkflowStatus(status: string): status is WorkflowStatus {
  return ['pending', 'running', 'completed', 'failed'].includes(status);
}

// ========== Constants ==========

export const STORY_DURATIONS: StoryDuration[] = ['5', '10', '30'];

export const WORKFLOW_STATUSES: WorkflowStatus[] = [
  'pending',
  'running',
  'completed',
  'failed',
];

export const WORKFLOW_IDS = {
  STORY_EXPANDER: 'story-expander-workflow',
  SCENE_GENERATOR: 'scene-generator-workflow',
  STORY_TO_SCENES: 'story-to-scenes-workflow',
  CREATE_SERIES: 'create-series-workflow',
  WRITE_EPISODE: 'write-episode-workflow',
} as const;

export type WorkflowId = (typeof WORKFLOW_IDS)[keyof typeof WORKFLOW_IDS];

// ========== Utility Types ==========

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;
