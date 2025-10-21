import { create } from 'zustand';
import type {
    SummaryInput,
    SummaryOutput,
    StorymakerInput,
    StorymakerOutput,
    UserSelections
} from '../lib/api/types/story.types';

interface StoryCreationState {
    // Form state
    coreIdea: string;
    desiredLength: string;

    // Menu state
    menuData: SummaryOutput | null;
    userSelections: UserSelections;

    // Story result
    generatedStory: StorymakerOutput | null;

    // UI state
    isMenuModalOpen: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    setCoreIdea: (idea: string) => void;
    setDesiredLength: (length: string) => void;
    setMenuData: (data: SummaryOutput) => void;
    setUserSelections: (selections: UserSelections) => void;
    updateSelection: (category: keyof UserSelections, optionId: string) => void;
    setGeneratedStory: (story: StorymakerOutput) => void;
    setMenuModalOpen: (open: boolean) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

const initialSelections: UserSelections = {
    protagonist: '',
    conflict: '',
    stage: '',
    soul: '',
};

export const useStoryCreationStore = create<StoryCreationState>((set) => ({
    // Initial state
    coreIdea: '',
    desiredLength: '10',
    menuData: null,
    userSelections: initialSelections,
    generatedStory: null,
    isMenuModalOpen: false,
    isLoading: false,
    error: null,

    // Actions
    setCoreIdea: (idea) => set({ coreIdea: idea }),
    setDesiredLength: (length) => set({ desiredLength: length }),
    setMenuData: (data) => set({ menuData: data }),
    setUserSelections: (selections) => set({ userSelections: selections }),
    updateSelection: (category, optionId) =>
        set((state) => ({
            userSelections: { ...state.userSelections, [category]: optionId }
        })),
    setGeneratedStory: (story) => set({ generatedStory: story }),
    setMenuModalOpen: (open) => set({ isMenuModalOpen: open }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    reset: () => set({
        coreIdea: '',
        desiredLength: '10',
        menuData: null,
        userSelections: initialSelections,
        generatedStory: null,
        isMenuModalOpen: false,
        isLoading: false,
        error: null,
    }),
}));
