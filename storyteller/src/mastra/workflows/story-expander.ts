import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

const expandStoryStep = createStep({
  id: 'expand-story',
  description: 'Expands a short story summary into a rich, long-form narrative',
  inputSchema: z.object({
    storySummary: z.string().describe('The short story summary to expand (approximately 200 words)'),
  }),
  outputSchema: z.object({
    fullStory: z.string().describe('The expanded full story (approximately 2000 words)'),
  }),
  execute: async ({ inputData, mastra }) => {
    if (!inputData?.storySummary) {
      throw new Error('Story summary is required');
    }

    const agent = mastra?.getAgent('llmAgent');
    if (!agent) {
      throw new Error('LLM agent not available');
    }

    const systemPrompt = `You are an expert storyteller. Your task is to take a brief story summary and expand it into a captivating, long-form narrative. Focus on:
- Vivid descriptions that bring scenes to life
- Emotional depth and character motivations
- Natural-sounding dialogue that reveals personality
- Proper pacing with rising action and tension
- Rich world-building details
- Show, don't tell - use sensory details
- Character thoughts and internal conflicts

Create a story of approximately 2000 words that is engaging, immersive, and complete.`;

    const prompt = `${systemPrompt}\n\nPlease expand the following summary into a full story of approximately 2000 words:\n\n${inputData.storySummary}`;

    const result = await agent.generate(prompt);

    if (!result.text) {
      throw new Error('Failed to generate story expansion');
    }

    return {
      fullStory: result.text,
    };
  },
});

export const storyExpanderWorkflow = createWorkflow({
  id: 'story-expander-workflow',
  inputSchema: z.object({
    storySummary: z.string().describe('The short story summary to expand'),
  }),
  outputSchema: z.object({
    fullStory: z.string().describe('The expanded full story'),
  }),
}).then(expandStoryStep);

storyExpanderWorkflow.commit();
