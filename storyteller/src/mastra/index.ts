
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { storyExpanderWorkflow } from './workflows/story-expander';
import { sceneGeneratorWorkflow } from './workflows/scene-generator';
import { storyToScenesWorkflow } from './workflows/story-to-scenes';
import { createSeriesWorkflow } from './workflows/create-series';
import { writeEpisodeWorkflow } from './workflows/write-episode';
import { summaryWorkflow } from './workflows/summary';
import { storymakerWorkflow } from './workflows/storymaker';
import { llmAgent } from './agents/llm-agent';

// Export schemas for external use
export * from './schemas';

export const mastra = new Mastra({
  workflows: {
    storyExpanderWorkflow,
    sceneGeneratorWorkflow,
    storyToScenesWorkflow,
    createSeriesWorkflow,
    writeEpisodeWorkflow,
    summaryWorkflow,
    storymakerWorkflow,
  },
  agents: {
    llmAgent,
  },
  storage: new LibSQLStore({
    // stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  telemetry: {
    // Telemetry is deprecated and will be removed in the Nov 4th release
    enabled: false,
  },
  observability: {
    // Enables DefaultExporter and CloudExporter for AI tracing
    default: { enabled: true },
  },
});
