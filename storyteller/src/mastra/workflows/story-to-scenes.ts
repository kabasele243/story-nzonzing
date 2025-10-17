import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

// --- MODIFIED SCHEMA ---
// Simplified to focus only on text-based consistency.
const characterSchema = z.object({
  name: z.string(),
  description: z.string(),
  keyTraits: z.string(),
  visualAnchorPrompt: z.string().describe('A self-contained, repeatable description chunk for image generation.'),
});

const sceneWithPromptSchema = z.object({
  sceneNumber: z.number(),
  description: z.string(),
  setting: z.string(),
  charactersPresent: z.array(z.string()),
  imagePrompt: z.string(),
});

// Step 1: Expand Story with duration support
const expandStoryStep = createStep({
  id: 'expand-story-combined',
  description: 'Expands a short story summary into a full narrative',
  inputSchema: z.object({
    storySummary: z.string(),
    duration: z.enum(['5', '10', '30']).default('10').describe('Story duration in minutes (5, 10, or 30)'),
  }),
  outputSchema: z.object({
    fullStory: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    if (!inputData?.storySummary) {
      throw new Error('Story summary is required');
    }
    const agent = mastra?.getAgent('llmAgent');
    if (!agent) {
      throw new Error('LLM agent not available');
    }

    // Calculate word count based on duration (average reading speed: ~150 words/minute)
    const durationMinutes = parseInt(inputData.duration || '10');
    const targetWords = durationMinutes * 150;

    const systemPrompt = `You are an expert storyteller. Expand a brief story summary into a captivating, long-form narrative of approximately ${targetWords} words (${durationMinutes} minutes reading time). Focus on vivid descriptions, emotional depth, natural dialogue, pacing, and rich world-building.`;
    const prompt = `${systemPrompt}\n\nPlease expand the following summary:\n\n${inputData.storySummary}`;
    const result = await agent.generate(prompt);
    if (!result.text) {
      throw new Error('Failed to generate story expansion');
    }
    return {
      fullStory: result.text,
    };
  },
});

// --- MODIFIED STEP 2 ---
// This is now the most critical step for consistency.
// It creates the 'visualAnchorPrompt' that will be reused.
const extractCharactersStep = createStep({
  id: 'extract-characters-combined',
  description: 'Extracts character profiles and creates a visual anchor prompt for each',
  inputSchema: z.object({
    fullStory: z.string(),
  }),
  outputSchema: z.object({
    fullStory: z.string(),
    characters: z.array(characterSchema),
  }),
  execute: async ({ inputData, mastra }) => {
    if (!inputData?.fullStory) {
      throw new Error('Full story is required');
    }
    const agent = mastra?.getAgent('llmAgent');
    if (!agent) {
      throw new Error('LLM agent not available');
    }

    const prompt = `You must respond with ONLY valid JSON.
Analyze the following story and identify every unique character. For each character, create a JSON object with:
1.  "name": The character's name.
2.  "description": A general description of their appearance and clothing.
3.  "keyTraits": Their personality and role in the story.
4.  "visualAnchorPrompt": A concise, consistent, and reusable description of their core physical features (face, hair, build, key visual markers) enclosed in parentheses. This will be used in every image prompt for this character to ensure consistency. Example: "(A 30-year-old man with messy brown hair, kind green eyes, a light beard, wearing a worn brown leather jacket)".

Return ONLY this JSON structure:
{
  "characters": [
    {
      "name": "Character Name",
      "description": "Physical description and clothing",
      "keyTraits": "Personality and role",
      "visualAnchorPrompt": "(A detailed and consistent visual description of the character's face and key features)"
    }
  ]
}

Story: ${inputData.fullStory}`;

    const result = await agent.generate(prompt);
    if (!result.text) {
      throw new Error('Failed to extract characters');
    }

    let cleanedText = result.text.trim().replace(/^```json\s*|```\s*$/g, '');
    const characterData = JSON.parse(cleanedText);

    return {
      fullStory: inputData.fullStory,
      characters: characterData.characters,
    };
  },
});

// Step 3: Segment Scenes (No changes)
const segmentScenesStep = createStep({
  id: 'segment-scenes-combined',
  description: 'Divides the story into distinct scenes',
  inputSchema: z.object({
    fullStory: z.string(),
    characters: z.array(characterSchema),
  }),
  outputSchema: z.object({
    fullStory: z.string(),
    characters: z.array(characterSchema),
    scenes: z.array(
      z.object({
        sceneNumber: z.number(),
        description: z.string(),
        setting: z.string(),
        charactersPresent: z.array(z.string()),
      }),
    ),
  }),
  execute: async ({ inputData, mastra }) => {
    if (!inputData?.fullStory) {
      throw new Error('Full story is required');
    }
    const agent = mastra?.getAgent('llmAgent');
    if (!agent) {
      throw new Error('LLM agent not available');
    }
    const prompt = `You must respond with ONLY valid JSON.
Read the following story and divide it into a sequence of distinct scenes based on changes in location, time, or action.
Return ONLY this JSON structure:
{
  "scenes": [
    {
      "sceneNumber": 1,
      "description": "Scene summary",
      "setting": "Location and time",
      "charactersPresent": ["Character1", "Character2"]
    }
  ]
}

Story: ${inputData.fullStory}`;

    const result = await agent.generate(prompt);
    if (!result.text) {
      throw new Error('Failed to segment scenes');
    }
    let cleanedText = result.text.trim().replace(/^```json\s*|```\s*$/g, '');
    const sceneData = JSON.parse(cleanedText);
    return {
      fullStory: inputData.fullStory,
      characters: inputData.characters,
      scenes: sceneData.scenes,
    };
  },
});

// --- MODIFIED STEP 4 ---
// Now relies entirely on the 'visualAnchorPrompt' for character details.
const generateImagePromptsStep = createStep({
  id: 'generate-image-prompts-combined',
  description: 'Generates image prompts for each scene using character anchors',
  inputSchema: z.object({
    fullStory: z.string(),
    characters: z.array(characterSchema),
    scenes: z.array(
      z.object({
        sceneNumber: z.number(),
        description: z.string(),
        setting: z.string(),
        charactersPresent: z.array(z.string()),
      }),
    ),
  }),
  outputSchema: z.object({
    fullStory: z.string(),
    characters: z.array(characterSchema),
    scenesWithPrompts: z.array(sceneWithPromptSchema),
  }),
  execute: async ({ inputData, mastra }) => {
    if (!inputData?.scenes || !inputData?.characters) {
      throw new Error('Scenes and characters are required');
    }
    const agent = mastra?.getAgent('llmAgent');
    if (!agent) {
      throw new Error('LLM agent not available');
    }
    const scenesWithPrompts = [];
    for (const scene of inputData.scenes) {
      const prompt = `You are an expert prompt engineer for image generation models.

**Character Reference Sheet (Use these EXACTLY):**
${JSON.stringify(inputData.characters, null, 2)}

**Scene to Visualize:**
Scene ${scene.sceneNumber}: ${scene.description}
Setting: ${scene.setting}
Characters Present: ${scene.charactersPresent.join(', ')}

**Task:** Create a single, highly detailed image prompt.
- **Subject:** For each character present, you MUST copy their 'visualAnchorPrompt' from the sheet verbatim. Then describe their actions based on the scene description.
- **Setting:** Detail the environment from the scene's setting.
- **Style:** Specify composition (e.g., wide shot, close-up), lighting (e.g., moody, bright afternoon), and artistic style (e.g., cinematic, photorealistic, anime).

Output ONLY the final prompt string. Do not include any other text or explanations.`;

      const result = await agent.generate(prompt);
      if (!result.text) {
        throw new Error(`Failed to generate image prompt for scene ${scene.sceneNumber}`);
      }
      scenesWithPrompts.push({
        ...scene,
        imagePrompt: result.text.trim(),
      });
    }
    return {
      fullStory: inputData.fullStory,
      characters: inputData.characters,
      scenesWithPrompts,
    };
  },
});

// --- MODIFIED WORKFLOW ---
// The chain is now simpler without the portrait generation step.
export const storyToScenesWorkflow = createWorkflow({
  id: 'story-to-scenes-workflow',
  inputSchema: z.object({
    storySummary: z.string().describe('Short story summary (approximately 200 words)'),
    duration: z.enum(['5', '10', '30']).default('10').describe('Story duration in minutes (5, 10, or 30)'),
  }),
  outputSchema: z.object({
    fullStory: z.string(),
    characters: z.array(characterSchema),
    scenesWithPrompts: z.array(sceneWithPromptSchema),
  }),
})
  .then(expandStoryStep)
  .then(extractCharactersStep) // Defines the character's look
  .then(segmentScenesStep)
  .then(generateImagePromptsStep); // Reuses the character's look in every scene

storyToScenesWorkflow.commit();