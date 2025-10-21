import { z } from 'zod';

// Schema definitions for the summary workflow based on the Storyteller's Compass framework
export const creativeOptionSchema = z.object({
    optionID: z.string().describe('A simple identifier for the option (e.g., A, B, C)'),
    optionTitle: z.string().describe('A short, evocative title for the option'),
    details: z.record(z.string(), z.string()).describe('A flexible object containing the descriptive text for the option, broken into logical parts'),
});

export const storyCategorySchema = z.object({
    categoryID: z.enum(['protagonist', 'conflict', 'stage', 'soul']).describe('A unique machine-readable identifier for the category'),
    categoryTitle: z.string().describe('The human-readable title for the category'),
    options: z.array(creativeOptionSchema).describe('A list of mutually exclusive choices within this category'),
});

export const userInputAnalysisSchema = z.object({
    requestedLength: z.string().describe('The requested story length (e.g., "40 min", "5 minutes")'),
    coreIdea: z.string().describe('The core idea or summary provided by the user'),
    analysisNotes: z.string().describe('The agent\'s high-level analysis of the request and its implications for story structure'),
});

export const storyConstructionMenuSchema = z.object({
    userInputAnalysis: userInputAnalysisSchema,
    storyConstructionMenu: z.array(storyCategorySchema),
});

// Input schema for the summary workflow
export const summaryWorkflowInputSchema = z.object({
    desiredLength: z.string().describe('The desired story length (e.g., 3, 5, 10, 40 minutes)'),
    coreIdea: z.string().describe('A brief sentence or two describing the core idea/summary'),
});
