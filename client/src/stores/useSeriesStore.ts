import { create } from 'zustand';
import { SeriesContext } from '@/lib/api';

interface SeriesWithId extends SeriesContext {
  id: string;
  user_id: string;
  clerk_user_id: string;
  summary: string;
  number_of_episodes: number;
  created_at: string;
  updated_at: string;
}

interface SeriesState {
  // State
  seriesList: SeriesWithId[];
  currentSeries: SeriesContext | null;
  currentSeriesId: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  setSeriesList: (series: SeriesWithId[]) => void;
  setCurrentSeries: (series: SeriesContext | null, seriesId?: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCurrentSeries: () => void;
  addSeries: (series: SeriesWithId) => void;
  updateSeriesInList: (seriesId: string, updates: Partial<SeriesWithId>) => void;
}

export const useSeriesStore = create<SeriesState>((set) => ({
  // Initial state
  seriesList: [],
  currentSeries: null,
  currentSeriesId: null,
  loading: false,
  error: null,

  // Actions
  setSeriesList: (seriesList) => set({ seriesList }),

  setCurrentSeries: (currentSeries, seriesId = null) =>
    set({ currentSeries, currentSeriesId: seriesId }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearCurrentSeries: () => set({ currentSeries: null, currentSeriesId: null }),

  addSeries: (series) =>
    set((state) => ({ seriesList: [series, ...state.seriesList] })),

  updateSeriesInList: (seriesId, updates) =>
    set((state) => ({
      seriesList: state.seriesList.map((s) =>
        s.id === seriesId ? { ...s, ...updates } : s
      ),
    })),
}));
