import { Agent } from '@mastra/core/agent';

export const llmAgent = new Agent({
  name: 'LLM Agent',
  instructions: 'You are a helpful AI assistant that processes requests accurately.',
  model: 'google/gemini-2.0-flash-exp',
});
