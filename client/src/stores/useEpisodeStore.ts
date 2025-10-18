import { create } from 'zustand';
import { WriteEpisodeOutput } from '@/lib/api';

interface Episode extends WriteEpisodeOutput {
  id: string;
  series_id: string;
  clerk_user_id: string;
  episode_number: number;
  created_at: string;
  updated_at: string;
}

interface EpisodeState {
  // State - Map of series ID to episodes
  episodesBySeriesId: Map<string, Episode[]>;
  currentEpisode: Episode | null;
  loading: boolean;
  error: string | null;

  // Actions
  setEpisodesForSeries: (seriesId: string, episodes: Episode[]) => void;
  addEpisode: (seriesId: string, episode: Episode) => void;
  setCurrentEpisode: (episode: Episode | null) => void;
  getEpisodesForSeries: (seriesId: string) => Episode[] | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearEpisodesForSeries: (seriesId: string) => void;
}

export const useEpisodeStore = create<EpisodeState>((set, get) => ({
  // Initial state
  episodesBySeriesId: new Map(),
  currentEpisode: null,
  loading: false,
  error: null,

  // Actions
  setEpisodesForSeries: (seriesId, episodes) =>
    set((state) => {
      const newMap = new Map(state.episodesBySeriesId);
      newMap.set(seriesId, episodes);
      return { episodesBySeriesId: newMap };
    }),

  addEpisode: (seriesId, episode) =>
    set((state) => {
      const newMap = new Map(state.episodesBySeriesId);
      const existing = newMap.get(seriesId) || [];
      // Add or update episode
      const filtered = existing.filter((e) => e.episode_number !== episode.episode_number);
      newMap.set(seriesId, [...filtered, episode].sort((a, b) => a.episode_number - b.episode_number));
      return { episodesBySeriesId: newMap };
    }),

  setCurrentEpisode: (currentEpisode) => set({ currentEpisode }),

  getEpisodesForSeries: (seriesId) => {
    return get().episodesBySeriesId.get(seriesId);
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearEpisodesForSeries: (seriesId) =>
    set((state) => {
      const newMap = new Map(state.episodesBySeriesId);
      newMap.delete(seriesId);
      return { episodesBySeriesId: newMap };
    }),
}));
