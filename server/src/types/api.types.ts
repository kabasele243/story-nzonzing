import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  userId: string;
  user: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationQuery {
  limit?: number;
  offset?: number;
}

export interface CreateStoryRequest {
  storySummary: string;
  duration?: string;
  title?: string;
}

export interface CreateSeriesRequest {
  storySummary: string;
  numberOfEpisodes: number;
}

export interface WriteEpisodeRequest {
  seriesId?: string;
  seriesContext: any;
  episodeNumber: number;
  duration?: string;
  previousEpisodes?: any[];
}
