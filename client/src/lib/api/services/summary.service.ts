import { API_BASE_URL } from '../config';
import type { SummaryInput, SummaryOutput } from '../types/story.types';

export async function generateSummary(input: SummaryInput): Promise<SummaryOutput> {
    const response = await fetch(`${API_BASE_URL}/summary`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate story construction menu');
    }

    const result = await response.json();
    return result.data;
}
