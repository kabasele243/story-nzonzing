import { create } from 'zustand';

interface User {
  id: string;
  clerk_user_id: string;
  email: string;
  username: string | null;
  created_at: string;
  updated_at: string;
}

interface UserState {
  // State
  user: User | null;
  loading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  // Initial state
  user: null,
  loading: false,
  error: null,

  // Actions
  setUser: (user) => set({ user }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearUser: () => set({ user: null }),
}));
