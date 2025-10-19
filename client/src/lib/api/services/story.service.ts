import { API_BASE_URL } from '../config';
import type {
  StoryExpanderInput,
  StoryExpanderOutput,
  SceneGeneratorInput,
  SceneGeneratorOutput,
  CompletePipelineInput,
  CompletePipelineOutput
} from '../types/story.types';

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

// Complete Pipeline API - WITH AUTHENTICATION
export async function runCompletePipeline(
  input: CompletePipelineInput,
  authToken: string
): Promise<CompletePipelineOutput> {
  const response = await fetch(`${API_BASE_URL}/story-to-scenes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to run complete pipeline');
  }

  const result = await response.json();

  // Return the full data including storyId
  return {
    fullStory: result.data.fullStory || '',
    characters: result.data.characters || [],
    scenesWithPrompts: result.data.scenesWithPrompts || [],
    storyId: result.data.storyId,
  };
}
