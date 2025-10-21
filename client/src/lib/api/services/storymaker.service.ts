import { API_BASE_URL } from '../config';
import type { StorymakerInput, StorymakerOutput } from '../types/story.types';

export async function generateStory(input: StorymakerInput): Promise<StorymakerOutput> {
    const response = await fetch(`${API_BASE_URL}/storymaker`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate story');
    }

    const result = await response.json();
    return result.data;
}
