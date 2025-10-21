import { createStep, createWorkflow } from '@mastra/core/workflows';
import {
    storyBlueprintInputSchema,
    finalStorySchema
} from '../schemas/storymaker.schemas';
import {
    extractSelectedOptions,
    generateStoryPrompt,
    processStoryResponse
} from '../utils/story.utils';

// Main step that generates the complete story
const generateStoryStep = createStep({
    id: 'generate-complete-story',
    description: 'Generates a complete story based on user selections from the story construction menu',
    inputSchema: storyBlueprintInputSchema,
    outputSchema: finalStorySchema,
    execute: async ({ inputData, mastra }) => {
        if (!inputData?.userSelections) {
            throw new Error('User selections are required');
        }
        if (!inputData?.storyConstructionMenu) {
            throw new Error('Story construction menu is required');
        }

        const agent = mastra?.getAgent('llmAgent');
        if (!agent) {
            throw new Error('LLM agent not available');
        }

        // Extract the selected options from the menu using utility function
        const selectedOptions = extractSelectedOptions(inputData);

        // Generate the story prompt using utility function
        const prompt = generateStoryPrompt(inputData, selectedOptions);

        // Generate the story
        const result = await agent.generate(prompt);
        if (!result.text) {
            throw new Error('Failed to generate story');
        }

        // Process the response using utility function
        return processStoryResponse(result.text);
    },
});

// Create the workflow
export const storymakerWorkflow = createWorkflow({
    id: 'storymaker-workflow',
    inputSchema: storyBlueprintInputSchema,
    outputSchema: finalStorySchema,
}).then(generateStoryStep);

storymakerWorkflow.commit();
