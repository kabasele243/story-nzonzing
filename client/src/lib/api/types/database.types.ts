// Database record types

import type {
  SeriesContext,
  WriteEpisodeOutput
} from './series.types';

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
