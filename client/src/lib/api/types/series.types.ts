// Series-related type definitions

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
