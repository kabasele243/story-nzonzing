import { sanitizeJsonString } from './json.utils';

// Type definitions for story generation
export interface SelectedOption {
    title: string;
    details: Record<string, string>;
}

export interface StoryGenerationContext {
    userSelections: {
        protagonist: string;
        conflict: string;
        stage: string;
        soul: string;
    };
    storyConstructionMenu: Array<{
        categoryID: 'protagonist' | 'conflict' | 'stage' | 'soul';
        categoryTitle: string;
        options: Array<{
            optionID: string;
            optionTitle: string;
            details: Record<string, string>;
        }>;
    }>;
    userInputAnalysis: {
        requestedLength: string;
        coreIdea: string;
        analysisNotes: string;
    };
}

/**
 * Extracts the selected options from the story construction menu
 */
export function extractSelectedOptions(context: StoryGenerationContext): Record<string, SelectedOption> {
    const selectedOptions: Record<string, SelectedOption> = {};

    for (const category of context.storyConstructionMenu) {
        const selectedOption = category.options.find(
            option => option.optionID === context.userSelections[category.categoryID]
        );
        if (selectedOption) {
            selectedOptions[category.categoryID] = {
                title: selectedOption.optionTitle,
                details: selectedOption.details,
            };
        }
    }

    return selectedOptions;
}

/**
 * Generates the story generation prompt
 */
export function generateStoryPrompt(context: StoryGenerationContext, selectedOptions: Record<string, SelectedOption>): string {
    return `You are an expert storyteller tasked with creating a complete, engaging story based on specific creative choices.
    
        **User's Story Request:**
        - Core Idea: ${context.userInputAnalysis.coreIdea}
        - Desired Length: ${context.userInputAnalysis.requestedLength}
        - Analysis: ${context.userInputAnalysis.analysisNotes}

        **Selected Story Elements:**

        **Protagonist & Characters (${selectedOptions.protagonist?.title}):**
        ${Object.entries(selectedOptions.protagonist?.details || {}).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

        **Central Conflict (${selectedOptions.conflict?.title}):**
        ${Object.entries(selectedOptions.conflict?.details || {}).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

        **Stage/Setting (${selectedOptions.stage?.title}):**
        ${Object.entries(selectedOptions.stage?.details || {}).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

        **Soul/Theme (${selectedOptions.soul?.title}):**
        ${Object.entries(selectedOptions.soul?.details || {}).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

        **Your Task:** Write a complete, engaging story that weaves together all these elements. The story should:

        1. **Honor the user's creative choices** - Use the selected protagonist, conflict, stage, and soul elements as the foundation
        2. **Match the desired length** - Structure the story appropriately for ${context.userInputAnalysis.requestedLength}
        3. **Create compelling narrative flow** - Build tension, develop characters, and deliver a satisfying resolution
        4. **Maintain consistency** - Ensure all elements work together harmoniously
        5. **Engage the reader** - Use vivid descriptions, compelling dialogue, and emotional depth

        **Response Format:** You must respond with ONLY valid JSON following this exact structure:

        {
        "metadata": {
            "title": "Your compelling story title",
            "generatedOn": "2025-01-20T17:30:53-04:00",
            "wordCount": 988,
            "estimatedReadTime": "6 minutes",
            "basedOnBlueprint": {
            "protagonist": "${context.userSelections.protagonist}",
            "conflict": "${context.userSelections.conflict}",
            "stage": "${context.userSelections.stage}",
            "soul": "${context.userSelections.soul}"
            }
        },
        "storyContent": "Your complete story text here. Write in a compelling narrative style with proper pacing, character development, and resolution. Make it engaging and memorable."
        }

        **Writing Guidelines:**
        - Start with a strong hook that draws readers in
        - Develop characters with clear motivations and growth
        - Build tension through conflict and obstacles
        - Use the setting to enhance mood and atmosphere
        - Weave the theme throughout without being heavy-handed
        - End with a satisfying resolution that feels earned
        - Aim for the target length while maintaining quality

        Write a story that the user will be proud to have created!`;
}

/**
 * Processes the AI response and extracts the story data
 */
export function processStoryResponse(responseText: string) {
    const cleanedText = sanitizeJsonString(responseText);
    const storyData = JSON.parse(cleanedText);

    return {
        metadata: storyData.metadata,
        storyContent: storyData.storyContent,
    };
}
