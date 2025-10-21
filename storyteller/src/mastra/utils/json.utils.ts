/**
 * Helper function to sanitize JSON strings by removing/escaping control characters
 * and cleaning markdown code fences
 */
export function sanitizeJsonString(jsonString: string): string {
    if (!jsonString || typeof jsonString !== 'string') {
        throw new Error('Invalid input: jsonString must be a non-empty string');
    }

    // First, clean markdown code fences and trim
    let cleaned = jsonString.trim().replace(/^```json\s*|```\s*$/g, '').trim();

    if (!cleaned) {
        throw new Error('Empty string after cleaning markdown code fences');
    }

    // Try to extract JSON object or array if there's text before/after it
    // This regex finds the outermost JSON structure
    const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
        cleaned = jsonMatch[0];
    }

    return cleaned;
}
