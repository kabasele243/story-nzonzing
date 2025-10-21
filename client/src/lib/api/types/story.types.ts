// Story-related type definitions

export interface StoryExpanderInput {
  storySummary: string;
  duration?: '5' | '10' | '30';
}

export interface StoryExpanderOutput {
  fullStory: string;
}

export interface Character {
  name: string;
  description: string;
  keyTraits: string;
}

export interface SceneWithPrompt {
  sceneNumber: number;
  description: string;
  setting: string;
  charactersPresent: string[];
  imagePrompt: string;
}

export interface SceneGeneratorInput {
  fullStory: string;
}

export interface SceneGeneratorOutput {
  scenesWithPrompts: SceneWithPrompt[];
}

export interface CompletePipelineInput {
  storySummary: string;
  duration?: '5' | '10' | '30';
}

export interface CompletePipelineOutput {
  fullStory: string;
  characters: Character[];
  scenesWithPrompts: SceneWithPrompt[];
  storyId?: string; // Database ID of the saved story
}

// Story Creation Menu Types
export interface StoryOption {
  optionID: string;
  optionTitle: string;
  details: Record<string, string>;
}

export interface StoryCategory {
  categoryID: 'protagonist' | 'conflict' | 'stage' | 'soul';
  categoryTitle: string;
  options: StoryOption[];
}

export interface UserInputAnalysis {
  requestedLength: string;
  coreIdea: string;
  analysisNotes: string;
}

export interface SummaryInput {
  desiredLength: string;
  coreIdea: string;
}

export interface SummaryOutput {
  userInputAnalysis: UserInputAnalysis;
  storyConstructionMenu: StoryCategory[];
}

// Storymaker Types
export interface UserSelections {
  protagonist: string;
  conflict: string;
  stage: string;
  soul: string;
}

export interface StorymakerInput {
  userSelections: UserSelections;
  storyConstructionMenu: StoryCategory[];
  userInputAnalysis: UserInputAnalysis;
}

export interface StoryMetadata {
  title: string;
  generatedOn: string;
  wordCount: number;
  estimatedReadTime: string;
  basedOnBlueprint: UserSelections;
}

export interface StorymakerOutput {
  metadata: StoryMetadata;
  storyContent: string;
}
