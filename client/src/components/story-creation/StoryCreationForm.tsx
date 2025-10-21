'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface StoryCreationFormProps {
    coreIdea: string;
    desiredLength: string;
    onCoreIdeaChange: (idea: string) => void;
    onDesiredLengthChange: (length: string) => void;
    onGenerateMenu: () => void;
    isLoading: boolean;
    error: string | null;
}

const lengthOptions = [
    { value: '5', label: '5 minutes' },
    { value: '10', label: '10 minutes' },
    { value: '20', label: '20 minutes' },
    { value: '40', label: '40 minutes' },
];

const storyTemplates = [
    {
        id: 'detective-ai',
        title: 'Detective AI',
        idea: 'A detective discovers that the AI she\'s been hunting is actually her own consciousness from the future, trying to prevent a catastrophic event.',
        genre: 'Sci-Fi Thriller',
    },
    {
        id: 'last-librarian',
        title: 'The Last Librarian',
        idea: 'In a world where books are banned, a librarian discovers that fictional characters are escaping from the last remaining library and entering the real world.',
        genre: 'Fantasy',
    },
    {
        id: 'time-cafe',
        title: 'The Time Café',
        idea: 'A café exists outside of time where people from different eras meet by chance. A barista realizes they can change history through the conversations that happen there.',
        genre: 'Time Travel',
    },
    {
        id: 'forgotten-melody',
        title: 'Forgotten Melody',
        idea: 'A musician discovers that the song stuck in their head is actually a memory from a past life, and learning the full melody could unlock dangerous powers.',
        genre: 'Mystery/Fantasy',
    },
];

export function StoryCreationForm({
    coreIdea,
    desiredLength,
    onCoreIdeaChange,
    onDesiredLengthChange,
    onGenerateMenu,
    isLoading,
    error,
}: StoryCreationFormProps) {
    const [localCoreIdea, setLocalCoreIdea] = useState(coreIdea);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCoreIdeaChange(localCoreIdea);
        onGenerateMenu();
    };

    return (
        <Card className="p-8 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="coreIdea" className="block text-sm font-medium text-foreground mb-2">
                        What's your story idea?
                    </label>

                    {/* Template Pills */}
                    <div className="mb-3 flex flex-wrap gap-2">
                        <span className="text-xs text-text-secondary">Try a template:</span>
                        {storyTemplates.map((template) => (
                            <button
                                key={template.id}
                                type="button"
                                onClick={() => setLocalCoreIdea(template.idea)}
                                className="px-3 py-1 text-xs rounded-full bg-primary-accent/10 hover:bg-primary-accent/20 text-primary-accent border border-primary-accent/20 transition-colors"
                            >
                                {template.title}
                            </button>
                        ))}
                    </div>

                    <textarea
                        id="coreIdea"
                        value={localCoreIdea}
                        onChange={(e) => setLocalCoreIdea(e.target.value)}
                        placeholder="A detective discovers that the AI she's been hunting is actually her own consciousness from the future..."
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent bg-card-bg text-foreground placeholder-text-secondary"
                        rows={4}
                        required
                    />
                    <p className="text-sm text-text-secondary mt-1">
                        Describe the core concept, characters, or situation that interests you
                    </p>
                </div>

                <div>
                    <label htmlFor="desiredLength" className="block text-sm font-medium text-foreground mb-2">
                        How long should your story be?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {lengthOptions.map((option) => (
                            <label
                                key={option.value}
                                className={`relative flex cursor-pointer rounded-lg p-4 border-2 transition-all ${desiredLength === option.value
                                    ? 'border-primary-accent bg-primary-accent/10'
                                    : 'border-border hover:border-hover'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="desiredLength"
                                    value={option.value}
                                    checked={desiredLength === option.value}
                                    onChange={(e) => onDesiredLengthChange(e.target.value)}
                                    className="sr-only"
                                />
                                <div className="flex flex-col items-center text-center">
                                    <span className="text-sm font-medium text-foreground">
                                        {option.label}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={isLoading || !localCoreIdea.trim()}
                    className="w-full bg-primary-accent hover:bg-primary-accent/90 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Generating Story Options...
                        </div>
                    ) : (
                        'Generate Story Options'
                    )}
                </Button>
            </form>
        </Card>
    );
}
