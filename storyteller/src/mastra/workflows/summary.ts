import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { sanitizeJsonString } from '../utils/json.utils';
import {
  storyConstructionMenuSchema,
  summaryWorkflowInputSchema
} from '../schemas/summary.schemas';

// Main step that generates the story construction menu
const generateStoryConstructionMenuStep = createStep({
  id: 'generate-story-construction-menu',
  description: 'Generates a structured menu of story choices based on user input using the Storyteller\'s Compass framework',
  inputSchema: summaryWorkflowInputSchema,
  outputSchema: storyConstructionMenuSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData?.coreIdea) {
      throw new Error('Core idea is required');
    }
    if (!inputData?.desiredLength) {
      throw new Error('Desired length is required');
    }

    const agent = mastra?.getAgent('llmAgent');
    if (!agent) {
      throw new Error('LLM agent not available');
    }

    const prompt = `You are an expert storyteller using the Storyteller's Compass framework. 
    Your task is to analyze a user's story request and generate a structured 
    menu of creative options across the four key pillars: protagonist, conflict, stage, and soul.

    **User Input:**
    - Desired Length: ${inputData.desiredLength}
    - Core Idea: ${inputData.coreIdea}

    **Task:** You must respond with ONLY valid JSON following this exact structure:

    {
      "userInputAnalysis": {
        "requestedLength": "${inputData.desiredLength}",
        "coreIdea": "${inputData.coreIdea}",
        "analysisNotes": "Your analysis of what this length means for story structure and pacing"
      },
      "storyConstructionMenu": [
        {
          "categoryID": "protagonist",
          "categoryTitle": "The Protagonist & Characters",
          "options": [
            {
              "optionID": "A",
              "optionTitle": "Title for protagonist option A",
              "details": {
                "The Protagonist": "Description of the main character",
                "The Survivor": "Description of supporting character or antagonist"
              }
            },
            {
              "optionID": "B",
              "optionTitle": "Title for protagonist option B",
              "details": {
                "The Protagonist": "Description of the main character",
                "The Survivor": "Description of supporting character or antagonist"
              }
            },
            {
              "optionID": "C",
              "optionTitle": "Title for protagonist option C",
              "details": {
                "The Protagonist": "Description of the main character",
                "The Survivor": "Description of supporting character or antagonist"
              }
            }
          ]
        },
        {
          "categoryID": "conflict",
          "categoryTitle": "The Central Conflict",
          "options": [
            {
              "optionID": "A",
              "optionTitle": "Title for conflict option A",
              "details": {
                "Description": "Description of the central conflict (internal/external/combination)"
              }
            },
            {
              "optionID": "B",
              "optionTitle": "Title for conflict option B",
              "details": {
                "Description": "Description of the central conflict (internal/external/combination)"
              }
            },
            {
              "optionID": "C",
              "optionTitle": "Title for conflict option C",
              "details": {
                "Description": "Description of the central conflict (internal/external/combination)"
              }
            }
          ]
        },
        {
          "categoryID": "stage",
          "categoryTitle": "The Stage (World & Atmosphere)",
          "options": [
            {
              "optionID": "A",
              "optionTitle": "Title for stage option A",
              "details": {
                "Setting": "Description of the world/setting",
                "Atmosphere": "Description of the atmosphere and mood"
              }
            },
            {
              "optionID": "B",
              "optionTitle": "Title for stage option B",
              "details": {
                "Setting": "Description of the world/setting",
                "Atmosphere": "Description of the atmosphere and mood"
              }
            },
            {
              "optionID": "C",
              "optionTitle": "Title for stage option C",
              "details": {
                "Setting": "Description of the world/setting",
                "Atmosphere": "Description of the atmosphere and mood"
              }
            }
          ]
        },
        {
          "categoryID": "soul",
          "categoryTitle": "The Soul (Theme & Tone)",
          "options": [
            {
              "optionID": "A",
              "optionTitle": "Title for soul option A",
              "details": {
                "Theme": "Description of the central theme or message",
                "Tone": "Description of the narrative tone and style"
              }
            },
            {
              "optionID": "B",
              "optionTitle": "Title for soul option B",
              "details": {
                "Theme": "Description of the central theme or message",
                "Tone": "Description of the narrative tone and style"
              }
            },
            {
              "optionID": "C",
              "optionTitle": "Title for soul option C",
              "details": {
                "Theme": "Description of the central theme or message",
                "Tone": "Description of the narrative tone and style"
              }
            }
          ]
        }
      ]
    }

    **Guidelines for generating options:**
    1. **Protagonist & Characters**: Propose 2-3 distinct protagonist archetypes 
      that could be the hero of this story, with suggestions for supporting characters or antagonists.
    2. **The Conflict**: Outline 2-3 potential central conflicts that could drive the plot, 
      specifying if they are internal (personal struggle), external (physical obstacle or villain), 
      or a combination.
    3. **The Stage**: Suggest 2-3 different settings or worlds where the story could take place, 
      each paired with a corresponding atmosphere (e.g., "A mist-shrouded Victorian London, 
      creating an atmosphere of mystery and dread").
    4. **The Soul**: Offer 2-3 potential themes or central messages the story could explore, 
      along with a matching tone (e.g., "A theme of betrayal, told with a cynical and gritty tone").

    Make each option distinct and compelling, tailored to the user's core idea and desired length.`;

    const result = await agent.generate(prompt);
    if (!result.text) {
      throw new Error('Failed to generate story construction menu');
    }

    const cleanedText = sanitizeJsonString(result.text);
    const menuData = JSON.parse(cleanedText);

    return {
      userInputAnalysis: menuData.userInputAnalysis,
      storyConstructionMenu: menuData.storyConstructionMenu,
    };
  },
});

// Create the workflow
export const summaryWorkflow = createWorkflow({
  id: 'summary-workflow',
  inputSchema: summaryWorkflowInputSchema,
  outputSchema: storyConstructionMenuSchema,
}).then(generateStoryConstructionMenuStep);

summaryWorkflow.commit();
