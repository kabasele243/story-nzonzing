import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

// Import schemas from create-series (these should match)
const masterCharacterSchema = z.object({
  name: z.string(),
  description: z.string(),
  keyTraits: z.string(),
  visualAnchorPrompt: z.string(),
  role: z.string(),
});

const episodeOutlineSchema = z.object({
  episodeNumber: z.number(),
  title: z.string(),
  synopsis: z.string(),
  keyEvents: z.array(z.string()),
  charactersInvolved: z.array(z.string()),
});

const plotThreadSchema = z.object({
  name: z.string(),
  description: z.string(),
  startsInEpisode: z.number(),
  resolvesInEpisode: z.number().optional(),
});

const seriesContextSchema = z.object({
  seriesTitle: z.string(),
  seriesDescription: z.string(),
  tagline: z.string(),
  themes: z.array(z.string()),
  masterCharacters: z.array(masterCharacterSchema),
  episodeOutlines: z.array(episodeOutlineSchema),
  plotThreads: z.array(plotThreadSchema),
  totalEpisodes: z.number(),
});

const previousEpisodeSummarySchema = z.object({
  episodeNumber: z.number(),
  title: z.string(),
  summary: z.string(),
});

const imagePromptSchema = z.object({
  type: z.enum(['main', 'close-up', 'wide-shot', 'over-shoulder', 'dutch-angle', 'birds-eye']),
  prompt: z.string(),
  description: z.string().describe('What this angle/perspective shows'),
});

const sceneWithPromptsSchema = z.object({
  sceneNumber: z.number(),
  description: z.string(),
  setting: z.string(),
  charactersPresent: z.array(z.string()),
  imagePrompts: z.array(imagePromptSchema).describe('Multiple prompts for different angles/perspectives'),
});

// Step 1: Expand Episode Story
const expandEpisodeStoryStep = createStep({
  id: 'expand-episode-story',
  description: 'Expands the episode outline into a full narrative',
  inputSchema: z.object({
    seriesContext: seriesContextSchema,
    episodeNumber: z.number(),
    duration: z.enum(['5', '10', '30']).default('10'),
    previousEpisodes: z.array(previousEpisodeSummarySchema).optional(),
  }),
  outputSchema: z.object({
    seriesContext: seriesContextSchema,
    episodeNumber: z.number(),
    duration: z.string(),
    fullEpisode: z.string(),
    previousEpisodes: z.array(previousEpisodeSummarySchema).optional(),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent('llmAgent');
    if (!agent) {
      throw new Error('LLM agent not available');
    }

    const episodeOutline = inputData.seriesContext.episodeOutlines.find(
      (ep) => ep.episodeNumber === inputData.episodeNumber
    );

    if (!episodeOutline) {
      throw new Error(`Episode ${inputData.episodeNumber} not found in series context`);
    }

    // Calculate word count based on duration
    const durationMinutes = parseInt(inputData.duration || '10');
    const targetWords = durationMinutes * 150;

    // Get relevant plot threads for this episode
    const relevantPlotThreads = inputData.seriesContext.plotThreads.filter(
      (thread) =>
        thread.startsInEpisode <= inputData.episodeNumber &&
        (!thread.resolvesInEpisode || thread.resolvesInEpisode >= inputData.episodeNumber)
    );

    // Build context from previous episodes
    let previousContext = '';
    if (inputData.previousEpisodes && inputData.previousEpisodes.length > 0) {
      previousContext = '\n\nPREVIOUS EPISODES:\n' +
        inputData.previousEpisodes
          .map((ep) => `Episode ${ep.episodeNumber}: ${ep.title}\n${ep.summary}`)
          .join('\n\n');
    }

    const prompt = `You are an expert storyteller writing episode ${inputData.episodeNumber} of "${inputData.seriesContext.seriesTitle}".

SERIES CONTEXT:
Description: ${inputData.seriesContext.seriesDescription}
Themes: ${inputData.seriesContext.themes.join(', ')}

CHARACTERS (maintain consistency):
${inputData.seriesContext.masterCharacters.map((c) => `- ${c.name}: ${c.description} (${c.keyTraits})`).join('\n')}

ACTIVE PLOT THREADS:
${relevantPlotThreads.map((t) => `- ${t.name}: ${t.description}`).join('\n')}
${previousContext}

CURRENT EPISODE OUTLINE:
Title: ${episodeOutline.title}
Synopsis: ${episodeOutline.synopsis}
Key Events: ${episodeOutline.keyEvents.join(', ')}
Characters: ${episodeOutline.charactersInvolved.join(', ')}

Write a compelling ${targetWords}-word episode that:
1. Maintains character consistency (personality, behavior, relationships)
2. Advances the relevant plot threads
3. References events from previous episodes naturally
4. Sets up future episodes
5. Has vivid descriptions, emotional depth, natural dialogue
6. Feels like part of a cohesive series

Write the full episode now:`;

    const result = await agent.generate(prompt);
    if (!result.text) {
      throw new Error('Failed to expand episode');
    }

    return {
      seriesContext: inputData.seriesContext,
      episodeNumber: inputData.episodeNumber,
      duration: inputData.duration,
      fullEpisode: result.text,
      previousEpisodes: inputData.previousEpisodes,
    };
  },
});

// Step 2: Segment Episode Scenes
const segmentEpisodeScenesStep = createStep({
  id: 'segment-episode-scenes',
  description: 'Divides the episode into distinct scenes',
  inputSchema: z.object({
    seriesContext: seriesContextSchema,
    episodeNumber: z.number(),
    duration: z.string(),
    fullEpisode: z.string(),
    previousEpisodes: z.array(previousEpisodeSummarySchema).optional(),
  }),
  outputSchema: z.object({
    seriesContext: seriesContextSchema,
    episodeNumber: z.number(),
    duration: z.string(),
    fullEpisode: z.string(),
    scenes: z.array(
      z.object({
        sceneNumber: z.number(),
        description: z.string(),
        setting: z.string(),
        charactersPresent: z.array(z.string()),
      })
    ),
    previousEpisodes: z.array(previousEpisodeSummarySchema).optional(),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent('llmAgent');
    if (!agent) {
      throw new Error('LLM agent not available');
    }

    const prompt = `You must respond with ONLY valid JSON.
Read the following episode and divide it into distinct scenes based on changes in location, time, or action.

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

Episode: ${inputData.fullEpisode}`;

    const result = await agent.generate(prompt);
    if (!result.text) {
      throw new Error('Failed to segment scenes');
    }

    const cleanedText = result.text.trim().replace(/^```json\s*|```\s*$/g, '');
    const sceneData = JSON.parse(cleanedText);

    return {
      ...inputData,
      scenes: sceneData.scenes,
    };
  },
});

// Step 3: Generate Multi-Angle Image Prompts
const generateMultiAnglePromptsStep = createStep({
  id: 'generate-multi-angle-prompts',
  description: 'Generates multiple image prompts per scene with different angles and perspectives',
  inputSchema: z.object({
    seriesContext: seriesContextSchema,
    episodeNumber: z.number(),
    duration: z.string(),
    fullEpisode: z.string(),
    scenes: z.array(
      z.object({
        sceneNumber: z.number(),
        description: z.string(),
        setting: z.string(),
        charactersPresent: z.array(z.string()),
      })
    ),
    previousEpisodes: z.array(previousEpisodeSummarySchema).optional(),
  }),
  outputSchema: z.object({
    seriesTitle: z.string(),
    episodeNumber: z.number(),
    episodeTitle: z.string(),
    fullEpisode: z.string(),
    scenesWithPrompts: z.array(sceneWithPromptsSchema),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent('llmAgent');
    if (!agent) {
      throw new Error('LLM agent not available');
    }

    const episodeOutline = inputData.seriesContext.episodeOutlines.find(
      (ep) => ep.episodeNumber === inputData.episodeNumber
    );

    const scenesWithPrompts = [];

    for (const scene of inputData.scenes) {
      const prompt = `You must respond with ONLY valid JSON.
You are an expert prompt engineer for image generation. Create multiple image prompts for the SAME scene from DIFFERENT angles and perspectives.

**Master Character Reference (Use EXACTLY):**
${JSON.stringify(inputData.seriesContext.masterCharacters, null, 2)}

**Scene to Visualize:**
Scene ${scene.sceneNumber}: ${scene.description}
Setting: ${scene.setting}
Characters Present: ${scene.charactersPresent.join(', ')}

**Task:** Create 3-5 image prompts for this scene from different angles:
1. Main shot (medium/establishing shot)
2. Close-up (focus on character faces/emotions)
3. Wide shot (show full environment)
4. Over-shoulder or Dutch angle (dynamic perspective)
5. Optional: Bird's eye or another creative angle

For each prompt:
- Copy each character's visualAnchorPrompt EXACTLY from the reference
- Describe their specific actions in THIS scene
- Detail the setting and environment
- Specify the camera angle/perspective
- Include lighting and artistic style (cinematic, photorealistic, etc.)

Return ONLY this JSON structure:
{
  "imagePrompts": [
    {
      "type": "main",
      "prompt": "Full detailed image prompt with character descriptions and scene details",
      "description": "What this angle shows"
    },
    {
      "type": "close-up",
      "prompt": "Full detailed image prompt",
      "description": "What this angle shows"
    }
  ]
}`;

      const result = await agent.generate(prompt);
      if (!result.text) {
        throw new Error(`Failed to generate prompts for scene ${scene.sceneNumber}`);
      }

      const cleanedText = result.text.trim().replace(/^```json\s*|```\s*$/g, '');
      const promptData = JSON.parse(cleanedText);

      scenesWithPrompts.push({
        ...scene,
        imagePrompts: promptData.imagePrompts,
      });
    }

    return {
      seriesTitle: inputData.seriesContext.seriesTitle,
      episodeNumber: inputData.episodeNumber,
      episodeTitle: episodeOutline?.title || `Episode ${inputData.episodeNumber}`,
      fullEpisode: inputData.fullEpisode,
      scenesWithPrompts,
    };
  },
});

// Create the workflow
export const writeEpisodeWorkflow = createWorkflow({
  id: 'write-episode-workflow',
  inputSchema: z.object({
    seriesContext: seriesContextSchema.describe('Complete series context from create-series workflow'),
    episodeNumber: z.number().describe('Episode number to write (1-based)'),
    duration: z.enum(['5', '10', '30']).default('10').describe('Episode duration in minutes'),
    previousEpisodes: z
      .array(previousEpisodeSummarySchema)
      .optional()
      .describe('Summaries of previously written episodes for continuity'),
  }),
  outputSchema: z.object({
    seriesTitle: z.string(),
    episodeNumber: z.number(),
    episodeTitle: z.string(),
    fullEpisode: z.string(),
    scenesWithPrompts: z.array(sceneWithPromptsSchema),
  }),
})
  .then(expandEpisodeStoryStep)
  .then(segmentEpisodeScenesStep)
  .then(generateMultiAnglePromptsStep);

writeEpisodeWorkflow.commit();
