// Series-related API functions

import { API_BASE_URL } from '../config';
import type {
  CreateSeriesInput,
  CreateSeriesOutput,
  WriteEpisodeInput,
  WriteEpisodeOutput
} from '../types/series.types';
import type {
  SeriesWithId,
  SeriesWithEpisodes,
  SeriesRecord
} from '../types/database.types';
import { transformSeries, transformEpisode } from '../utils/transformers';

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
