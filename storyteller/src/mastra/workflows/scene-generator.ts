import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

// Define schemas for the workflow
const characterSchema = z.object({
  name: z.string(),
  description: z.string().describe('Physical appearance, clothing, etc.'),
  keyTraits: z.string().describe('Personality, role in the story'),
});

const sceneSchema = z.object({
  sceneNumber: z.number(),
  description: z.string().describe('Summary of events, setting, and characters present'),
  setting: z.string().describe('Location and time'),
  charactersPresent: z.array(z.string()).describe('Names of characters in this scene'),
});

const sceneWithPromptSchema = z.object({
  sceneNumber: z.number(),
  description: z.string(),
  setting: z.string(),
  charactersPresent: z.array(z.string()),
  imagePrompt: z.string().describe('Detailed image generation prompt'),
});

// Step 1: Extract Characters
const extractCharactersStep = createStep({
  id: 'extract-characters',
  description: 'Analyzes the story and extracts character profiles',
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

    const prompt = `You must respond with ONLY valid JSON, no markdown formatting, no code blocks, no explanations.

Analyze the following story and identify every unique character. For each character, create a JSON object with the keys "name", "description" (physical appearance, clothing, etc.), and "keyTraits" (personality, role in the story).

Return ONLY this JSON structure with no additional text:
{
  "characters": [
    {
      "name": "Character Name",
      "description": "Physical description",
      "keyTraits": "Personality and role"
    }
  ]
}

Story: ${inputData.fullStory}`;

    const result = await agent.generate(prompt);

    if (!result.text) {
      throw new Error('Failed to extract characters');
    }

    // Clean up response - remove markdown code blocks if present
    let cleanedText = result.text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    const characterData = JSON.parse(cleanedText);

    return {
      fullStory: inputData.fullStory,
      characters: characterData.characters,
    };
  },
});

// Step 2: Segment into Scenes
const segmentScenesStep = createStep({
  id: 'segment-scenes',
  description: 'Divides the story into distinct scenes',
  inputSchema: z.object({
    fullStory: z.string(),
    characters: z.array(characterSchema),
  }),
  outputSchema: z.object({
    scenes: z.array(sceneSchema),
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

    const prompt = `You must respond with ONLY valid JSON, no markdown formatting, no code blocks, no explanations.

Read the following story and divide it into a sequence of distinct scenes. A new scene begins with a change in location, a significant jump in time, or a major shift in the action.

Return ONLY this JSON structure with no additional text:
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

    // Clean up response - remove markdown code blocks if present
    let cleanedText = result.text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    const sceneData = JSON.parse(cleanedText);

    return {
      scenes: sceneData.scenes,
      characters: inputData.characters,
    };
  },
});

// Step 3: Generate Image Prompts
const generateImagePromptsStep = createStep({
  id: 'generate-image-prompts',
  description: 'Generates detailed image prompts for each scene',
  inputSchema: z.object({
    scenes: z.array(sceneSchema),
    characters: z.array(characterSchema),
  }),
  outputSchema: z.object({
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

    // Process each scene
    for (const scene of inputData.scenes) {
      const prompt = `You are an AI assistant that creates expert-level, detailed prompts for image generation models like Midjourney or DALL-E 3.

**Character Reference Sheet:**
${JSON.stringify(inputData.characters, null, 2)}

**Scene to Visualize:**
Scene ${scene.sceneNumber}: ${scene.description}
Setting: ${scene.setting}
Characters Present: ${scene.charactersPresent.join(', ')}

**Task:** Based on the scene description and the character reference sheet, create a single, highly detailed image prompt. The prompt should specify:

- **Subject:** The characters and their actions, using their descriptions from the reference sheet for consistency.
- **Setting:** A detailed description of the environment.
- **Composition:** The camera angle and shot type (e.g., wide shot, close-up, over-the-shoulder).
- **Lighting:** The mood and style of light (e.g., dramatic backlighting, soft morning light, golden hour).
- **Style:** An artistic style (e.g., cinematic, photorealistic, oil painting, anime, digital art).
- **Atmosphere:** The emotional tone and mood of the scene.

Your output should be ONLY the final prompt string, ready to use with an image generation model. Make it detailed, specific, and optimized for high-quality image generation.`;

      const result = await agent.generate(prompt);

      if (!result.text) {
        throw new Error(`Failed to generate image prompt for scene ${scene.sceneNumber}`);
      }

      scenesWithPrompts.push({
        sceneNumber: scene.sceneNumber,
        description: scene.description,
        setting: scene.setting,
        charactersPresent: scene.charactersPresent,
        imagePrompt: result.text.trim(),
      });
    }

    return {
      scenesWithPrompts,
    };
  },
});

// Main workflow that chains all steps together
export const sceneGeneratorWorkflow = createWorkflow({
  id: 'scene-generator-workflow',
  inputSchema: z.object({
    fullStory: z.string().describe('The complete story to analyze'),
  }),
  outputSchema: z.object({
    scenesWithPrompts: z.array(sceneWithPromptSchema),
  }),
})
  .then(extractCharactersStep)
  .then(segmentScenesStep)
  .then(generateImagePromptsStep);

sceneGeneratorWorkflow.commit();
