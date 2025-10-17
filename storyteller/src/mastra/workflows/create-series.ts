import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

// Schema definitions
const masterCharacterSchema = z.object({
  name: z.string(),
  description: z.string(),
  keyTraits: z.string(),
  visualAnchorPrompt: z.string().describe('Consistent visual description for use across all episodes'),
  role: z.string().describe('Role in the series (protagonist, antagonist, supporting, etc.)'),
});

const episodeOutlineSchema = z.object({
  episodeNumber: z.number(),
  title: z.string(),
  synopsis: z.string().describe('Brief synopsis of the episode'),
  keyEvents: z.array(z.string()).describe('Main events that happen in this episode'),
  charactersInvolved: z.array(z.string()).describe('Character names appearing in this episode'),
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

// Step 1: Generate Series Metadata
const generateSeriesMetadataStep = createStep({
  id: 'generate-series-metadata',
  description: 'Generates series title, description, tagline, and themes',
  inputSchema: z.object({
    storySummary: z.string(),
    numberOfEpisodes: z.number(),
  }),
  outputSchema: z.object({
    storySummary: z.string(),
    numberOfEpisodes: z.number(),
    seriesTitle: z.string(),
    seriesDescription: z.string(),
    tagline: z.string(),
    themes: z.array(z.string()),
  }),
  execute: async ({ inputData, mastra }) => {
    if (!inputData?.storySummary) {
      throw new Error('Story summary is required');
    }
    const agent = mastra?.getAgent('llmAgent');
    if (!agent) {
      throw new Error('LLM agent not available');
    }

    const prompt = `You must respond with ONLY valid JSON.
Analyze the following story summary and create series metadata for a ${inputData.numberOfEpisodes}-episode series.

Return ONLY this JSON structure:
{
  "seriesTitle": "Title of the series",
  "seriesDescription": "A comprehensive description of the series (2-3 paragraphs)",
  "tagline": "A catchy tagline for the series",
  "themes": ["theme1", "theme2", "theme3"]
}

Story Summary: ${inputData.storySummary}`;

    const result = await agent.generate(prompt);
    if (!result.text) {
      throw new Error('Failed to generate series metadata');
    }

    const cleanedText = result.text.trim().replace(/^```json\s*|```\s*$/g, '');
    const metadata = JSON.parse(cleanedText);

    return {
      storySummary: inputData.storySummary,
      numberOfEpisodes: inputData.numberOfEpisodes,
      seriesTitle: metadata.seriesTitle,
      seriesDescription: metadata.seriesDescription,
      tagline: metadata.tagline,
      themes: metadata.themes,
    };
  },
});

// Step 2: Create Master Character List
const createMasterCharactersStep = createStep({
  id: 'create-master-characters',
  description: 'Creates a master character list with consistent visual descriptions',
  inputSchema: z.object({
    storySummary: z.string(),
    numberOfEpisodes: z.number(),
    seriesTitle: z.string(),
    seriesDescription: z.string(),
    tagline: z.string(),
    themes: z.array(z.string()),
  }),
  outputSchema: z.object({
    storySummary: z.string(),
    numberOfEpisodes: z.number(),
    seriesTitle: z.string(),
    seriesDescription: z.string(),
    tagline: z.string(),
    themes: z.array(z.string()),
    masterCharacters: z.array(masterCharacterSchema),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent('llmAgent');
    if (!agent) {
      throw new Error('LLM agent not available');
    }

    const prompt = `You must respond with ONLY valid JSON.
Based on the following series information, identify all main characters that will appear throughout the series.

Series: ${inputData.seriesTitle}
Description: ${inputData.seriesDescription}
Original Summary: ${inputData.storySummary}

For each character, create:
1. "name": Character's name
2. "description": General appearance and clothing
3. "keyTraits": Personality and role in the series
4. "visualAnchorPrompt": A concise, consistent, reusable description of core physical features (face, hair, build, key visual markers) in parentheses. This will be used in every image across all episodes. Example: "(A 30-year-old woman with long black hair, sharp blue eyes, athletic build, wearing a red leather jacket)"
5. "role": Their role (protagonist, antagonist, supporting, mentor, etc.)

Return ONLY this JSON structure:
{
  "characters": [
    {
      "name": "Character Name",
      "description": "Physical description",
      "keyTraits": "Personality and role",
      "visualAnchorPrompt": "(Consistent visual description)",
      "role": "protagonist/antagonist/supporting/etc"
    }
  ]
}`;

    const result = await agent.generate(prompt);
    if (!result.text) {
      throw new Error('Failed to create master characters');
    }

    const cleanedText = result.text.trim().replace(/^```json\s*|```\s*$/g, '');
    const characterData = JSON.parse(cleanedText);

    return {
      ...inputData,
      masterCharacters: characterData.characters,
    };
  },
});

// Step 3: Generate Episode Outlines
const generateEpisodeOutlinesStep = createStep({
  id: 'generate-episode-outlines',
  description: 'Creates detailed outlines for each episode',
  inputSchema: z.object({
    storySummary: z.string(),
    numberOfEpisodes: z.number(),
    seriesTitle: z.string(),
    seriesDescription: z.string(),
    tagline: z.string(),
    themes: z.array(z.string()),
    masterCharacters: z.array(masterCharacterSchema),
  }),
  outputSchema: z.object({
    storySummary: z.string(),
    numberOfEpisodes: z.number(),
    seriesTitle: z.string(),
    seriesDescription: z.string(),
    tagline: z.string(),
    themes: z.array(z.string()),
    masterCharacters: z.array(masterCharacterSchema),
    episodeOutlines: z.array(episodeOutlineSchema),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent('llmAgent');
    if (!agent) {
      throw new Error('LLM agent not available');
    }

    const characterNames = inputData.masterCharacters.map((c) => c.name).join(', ');

    const prompt = `You must respond with ONLY valid JSON.
Create ${inputData.numberOfEpisodes} episode outlines for the series "${inputData.seriesTitle}".

Series Description: ${inputData.seriesDescription}
Themes: ${inputData.themes.join(', ')}
Characters: ${characterNames}
Original Summary: ${inputData.storySummary}

Create a compelling narrative arc across all episodes with:
- Clear beginning, middle, and end
- Character development
- Rising tension and climax
- Satisfying resolution

Return ONLY this JSON structure:
{
  "episodes": [
    {
      "episodeNumber": 1,
      "title": "Episode title",
      "synopsis": "2-3 sentence synopsis of what happens",
      "keyEvents": ["Event 1", "Event 2", "Event 3"],
      "charactersInvolved": ["Character1", "Character2"]
    }
  ]
}`;

    const result = await agent.generate(prompt);
    if (!result.text) {
      throw new Error('Failed to generate episode outlines');
    }

    const cleanedText = result.text.trim().replace(/^```json\s*|```\s*$/g, '');
    const outlineData = JSON.parse(cleanedText);

    return {
      ...inputData,
      episodeOutlines: outlineData.episodes,
    };
  },
});

// Step 4: Identify Plot Threads
const identifyPlotThreadsStep = createStep({
  id: 'identify-plot-threads',
  description: 'Identifies major plot threads that span multiple episodes',
  inputSchema: z.object({
    storySummary: z.string(),
    numberOfEpisodes: z.number(),
    seriesTitle: z.string(),
    seriesDescription: z.string(),
    tagline: z.string(),
    themes: z.array(z.string()),
    masterCharacters: z.array(masterCharacterSchema),
    episodeOutlines: z.array(episodeOutlineSchema),
  }),
  outputSchema: seriesContextSchema,
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent('llmAgent');
    if (!agent) {
      throw new Error('LLM agent not available');
    }

    const episodeSummaries = inputData.episodeOutlines
      .map((ep) => `Episode ${ep.episodeNumber}: ${ep.title} - ${ep.synopsis}`)
      .join('\n');

    const prompt = `You must respond with ONLY valid JSON.
Analyze the following episode outlines and identify major plot threads that span multiple episodes.

${episodeSummaries}

Return ONLY this JSON structure:
{
  "plotThreads": [
    {
      "name": "Plot thread name",
      "description": "What this plot thread is about",
      "startsInEpisode": 1,
      "resolvesInEpisode": 3
    }
  ]
}`;

    const result = await agent.generate(prompt);
    if (!result.text) {
      throw new Error('Failed to identify plot threads');
    }

    const cleanedText = result.text.trim().replace(/^```json\s*|```\s*$/g, '');
    const plotData = JSON.parse(cleanedText);

    return {
      seriesTitle: inputData.seriesTitle,
      seriesDescription: inputData.seriesDescription,
      tagline: inputData.tagline,
      themes: inputData.themes,
      masterCharacters: inputData.masterCharacters,
      episodeOutlines: inputData.episodeOutlines,
      plotThreads: plotData.plotThreads,
      totalEpisodes: inputData.numberOfEpisodes,
    };
  },
});

// Create the workflow
export const createSeriesWorkflow = createWorkflow({
  id: 'create-series-workflow',
  inputSchema: z.object({
    storySummary: z.string().describe('Story summary to turn into a series'),
    numberOfEpisodes: z.number().describe('Number of episodes in the series'),
  }),
  outputSchema: seriesContextSchema,
})
  .then(generateSeriesMetadataStep)
  .then(createMasterCharactersStep)
  .then(generateEpisodeOutlinesStep)
  .then(identifyPlotThreadsStep);

createSeriesWorkflow.commit();
