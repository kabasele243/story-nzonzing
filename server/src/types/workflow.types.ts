export interface WorkflowInfo {
  id: string;
  description: string;
  input: Record<string, string>;
  output: Record<string, string>;
}

export interface WorkflowResult<T = any> {
  status: 'success' | 'failed';
  result?: T;
  error?: string;
}

export interface StoryExpanderInput {
  storySummary: string;
  duration?: '5' | '10' | '30';
}

export interface StoryExpanderOutput {
  fullStory: string;
}

export interface SceneGeneratorInput {
  fullStory: string;
}

export interface SceneGeneratorOutput {
  scenesWithPrompts: Array<{
    sceneNumber?: number;
    description: string;
    imagePrompt?: string;
    imagePrompts?: Array<{ angle: string; prompt: string }>;
    location?: string;
    characters?: any[];
  }>;
}

export interface StoryToScenesInput {
  storySummary: string;
  duration?: '5' | '10' | '30';
}

export interface StoryToScenesOutput {
  fullStory: string;
  characters: any[];
  scenesWithPrompts: Array<{
    sceneNumber?: number;
    description: string;
    imagePrompt?: string;
    location?: string;
    characters?: any[];
  }>;
}

export interface CreateSeriesInput {
  storySummary: string;
  numberOfEpisodes: number;
}

export interface CreateSeriesOutput {
  seriesTitle: string;
  masterCharacters: any[];
  episodeOutlines: any[];
  plotThreads: any[];
}

export interface WriteEpisodeInput {
  seriesContext: any;
  episodeNumber: number;
  duration?: '5' | '10' | '30';
  previousEpisodes?: any[];
}

export interface WriteEpisodeOutput {
  episodeTitle?: string;
  fullEpisode: string;
  scenesWithPrompts: Array<{
    sceneNumber?: number;
    description: string;
    setting?: string;
    charactersPresent?: string[];
    imagePrompts?: Array<{
      type?: string;
      angle?: string;
      prompt: string;
      description?: string;
    }>;
  }>;
}
