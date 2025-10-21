'use client';

import { useState } from 'react';
import { useStoryCreationStore } from '@/stores/useStoryCreationStore';
import { generateSummary } from '@/lib/api/services/summary.service';
import { generateStory } from '@/lib/api/services/storymaker.service';
import { StoryCreationForm, StoryMenuModal, StoryResult } from '@/components/story-creation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function CreateStoryPage() {
    const [currentStep, setCurrentStep] = useState<'form' | 'menu' | 'result'>('form');

    const {
        coreIdea,
        desiredLength,
        menuData,
        userSelections,
        generatedStory,
        isMenuModalOpen,
        isLoading,
        error,
        setCoreIdea,
        setDesiredLength,
        setMenuData,
        setUserSelections,
        setGeneratedStory,
        setMenuModalOpen,
        setLoading,
        setError,
        reset,
    } = useStoryCreationStore();

    const handleGenerateMenu = async () => {
        if (!coreIdea.trim()) {
            setError('Please enter a core idea for your story');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await generateSummary({
                desiredLength,
                coreIdea,
            });

            setMenuData(result);
            setCurrentStep('menu');
            setMenuModalOpen(true);
        } catch (err: any) {
            setError(err.message || 'Failed to generate story options');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateStory = async () => {
        if (!menuData) return;

        // Check if all selections are made
        const { protagonist, conflict, stage, soul } = userSelections;
        if (!protagonist || !conflict || !stage || !soul) {
            setError('Please make a selection in all categories');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await generateStory({
                userSelections,
                storyConstructionMenu: menuData.storyConstructionMenu,
                userInputAnalysis: menuData.userInputAnalysis,
            });

            setGeneratedStory(result);
            setCurrentStep('result');
            setMenuModalOpen(false);
        } catch (err: any) {
            setError(err.message || 'Failed to generate story');
        } finally {
            setLoading(false);
        }
    };

    const handleStartOver = () => {
        reset();
        setCurrentStep('form');
    };

    return (
        <div className="min-h-screen bg-background">
            <ThemeToggle />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-foreground mb-4">
                            Create Your Story
                        </h1>
                        <p className="text-lg text-text-secondary">
                            Start with an idea, explore creative options, and generate your perfect story
                        </p>
                    </div>

                    {currentStep === 'form' && (
                        <StoryCreationForm
                            coreIdea={coreIdea}
                            desiredLength={desiredLength}
                            onCoreIdeaChange={setCoreIdea}
                            onDesiredLengthChange={setDesiredLength}
                            onGenerateMenu={handleGenerateMenu}
                            isLoading={isLoading}
                            error={error}
                        />
                    )}

                    {currentStep === 'result' && generatedStory && (
                        <StoryResult
                            story={generatedStory}
                            onStartOver={handleStartOver}
                        />
                    )}
                </div>
            </div>

            <StoryMenuModal
                isOpen={isMenuModalOpen}
                onClose={() => setMenuModalOpen(false)}
                menuData={menuData}
                userSelections={userSelections}
                onSelectionChange={setUserSelections}
                onGenerateStory={handleGenerateStory}
                isLoading={isLoading}
                error={error}
            />
        </div>
    );
}
