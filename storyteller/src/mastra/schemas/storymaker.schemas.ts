import { z } from 'zod';

// Schema for user's final story selections
export const storySelectionsSchema = z.object({
    protagonist: z.string().describe('The selected protagonist option ID (e.g., A, B, C)'),
    conflict: z.string().describe('The selected conflict option ID (e.g., A, B, C)'),
    stage: z.string().describe('The selected stage option ID (e.g., A, B, C)'),
    soul: z.string().describe('The selected soul option ID (e.g., A, B, C)'),
});

// Schema for story construction menu option
export const storyMenuOptionSchema = z.object({
    optionID: z.string(),
    optionTitle: z.string(),
    details: z.record(z.string(), z.string()),
});

// Schema for story construction menu category
export const storyMenuCategorySchema = z.object({
    categoryID: z.enum(['protagonist', 'conflict', 'stage', 'soul']),
    categoryTitle: z.string(),
    options: z.array(storyMenuOptionSchema),
});

// Schema for user input analysis
export const userInputAnalysisSchema = z.object({
    requestedLength: z.string(),
    coreIdea: z.string(),
    analysisNotes: z.string(),
});

// Schema for the complete story blueprint input
export const storyBlueprintInputSchema = z.object({
    userSelections: storySelectionsSchema,
    storyConstructionMenu: z.array(storyMenuCategorySchema),
    userInputAnalysis: userInputAnalysisSchema,
});

// Schema for story metadata
export const storyMetadataSchema = z.object({
    title: z.string().describe('The generated story title'),
    generatedOn: z.string().describe('ISO timestamp of generation'),
    wordCount: z.number().describe('Estimated word count of the story'),
    estimatedReadTime: z.string().describe('Estimated reading time (e.g., "6 minutes")'),
    basedOnBlueprint: storySelectionsSchema,
});

// Schema for the final story output
export const finalStorySchema = z.object({
    metadata: storyMetadataSchema,
    storyContent: z.string().describe('The complete story text'),
});
