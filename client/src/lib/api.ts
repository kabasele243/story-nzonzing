// API integration layer for Story Pipeline backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

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
}

// Story Expander API
export async function expandStory(input: StoryExpanderInput): Promise<StoryExpanderOutput> {
  const response = await fetch(`${API_BASE_URL}/expand-story`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to expand story');
  }

  const result = await response.json();
  const workflowData = result.data;

  // Extract from workflow steps structure
  const fullStory = workflowData.steps?.['expand-story']?.output?.fullStory || '';

  return { fullStory };
}

// Scene Generator API
export async function generateScenes(input: SceneGeneratorInput): Promise<SceneGeneratorOutput> {
  const response = await fetch(`${API_BASE_URL}/generate-scenes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate scenes');
  }

  const result = await response.json();
  const workflowData = result.data;

  // Extract from workflow steps structure
  const scenesWithPrompts = workflowData.steps?.['generate-prompts']?.output?.scenesWithPrompts || [];

  return { scenesWithPrompts };
}

// Complete Pipeline API
export async function runCompletePipeline(input: CompletePipelineInput): Promise<CompletePipelineOutput> {
  const response = await fetch(`${API_BASE_URL}/story-to-scenes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to run complete pipeline');
  }

  const result = await response.json();
  const workflowData = result.data;

  // Extract data from the workflow steps structure
  const fullStory = workflowData.steps['expand-story-combined']?.output?.fullStory || '';
  const characters = workflowData.steps['extract-characters-combined']?.output?.characters || [];
  const scenesWithPrompts = workflowData.steps['generate-image-prompts-combined']?.output?.scenesWithPrompts || [];

  return {
    fullStory,
    characters,
    scenesWithPrompts,
  };
}

// Health check
export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch('http://localhost:3000/health');
  return response.json();
}
