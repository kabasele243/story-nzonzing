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

export interface SummaryInput {
  desiredLength: string;
  coreIdea: string;
}

export interface SummaryOutput {
  userInputAnalysis: {
    requestedLength: string;
    coreIdea: string;
    analysisNotes: string;
  };
  storyConstructionMenu: Array<{
    categoryID: 'protagonist' | 'conflict' | 'stage' | 'soul';
    categoryTitle: string;
    options: Array<{
      optionID: string;
      optionTitle: string;
      details: Record<string, string>;
    }>;
  }>;
}

export interface StorymakerInput {
  userSelections: {
    protagonist: string;
    conflict: string;
    stage: string;
    soul: string;
  };
  storyConstructionMenu: Array<{
    categoryID: 'protagonist' | 'conflict' | 'stage' | 'soul';
    categoryTitle: string;
    options: Array<{
      optionID: string;
      optionTitle: string;
      details: Record<string, string>;
    }>;
  }>;
  userInputAnalysis: {
    requestedLength: string;
    coreIdea: string;
    analysisNotes: string;
  };
}

export interface StorymakerOutput {
  metadata: {
    title: string;
    generatedOn: string;
    wordCount: number;
    estimatedReadTime: string;
    basedOnBlueprint: {
      protagonist: string;
      conflict: string;
      stage: string;
      soul: string;
    };
  };
  storyContent: string;
}
