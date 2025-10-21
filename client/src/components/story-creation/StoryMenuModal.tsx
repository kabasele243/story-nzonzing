'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { SummaryOutput, UserSelections, StoryCategory, StoryOption } from '@/lib/api/types/story.types';

interface StoryMenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBack?: () => void;
    menuData: SummaryOutput | null;
    userSelections: UserSelections;
    onSelectionChange: (selections: UserSelections) => void;
    onGenerateStory: () => void;
    isLoading: boolean;
    error: string | null;
}

const categories: Array<{ id: keyof UserSelections; title: string; icon: string }> = [
    { id: 'protagonist', title: 'Protagonist & Characters', icon: '👤' },
    { id: 'conflict', title: 'Central Conflict', icon: '⚔️' },
    { id: 'stage', title: 'Stage & Setting', icon: '🌍' },
    { id: 'soul', title: 'Soul & Theme', icon: '💫' },
];

export function StoryMenuModal({
    isOpen,
    onClose,
    onBack,
    menuData,
    userSelections,
    onSelectionChange,
    onGenerateStory,
    isLoading,
    error,
}: StoryMenuModalProps) {
    const [activeCategory, setActiveCategory] = useState<keyof UserSelections>('protagonist');
    const [selectedOption, setSelectedOption] = useState<StoryOption | null>(null);

    if (!isOpen || !menuData) return null;

    const currentCategoryData = menuData.storyConstructionMenu.find(
        cat => cat.categoryID === activeCategory
    );

    const handleSelection = (option: StoryOption) => {
        setSelectedOption(option);
        onSelectionChange({
            ...userSelections,
            [activeCategory]: option.optionID,
        });
    };

    const handleNext = () => {
        const currentIndex = categories.findIndex(cat => cat.id === activeCategory);
        if (currentIndex < categories.length - 1) {
            setActiveCategory(categories[currentIndex + 1].id);
            setSelectedOption(null);
        }
    };

    const handlePrevious = () => {
        const currentIndex = categories.findIndex(cat => cat.id === activeCategory);
        if (currentIndex > 0) {
            setActiveCategory(categories[currentIndex - 1].id);
            setSelectedOption(null);
        }
    };

    const isAllSelected = Object.values(userSelections).every(selection => selection !== '');
    const currentIndex = categories.findIndex(cat => cat.id === activeCategory);

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/75 flex items-center justify-center p-4 z-50">
            <div className="bg-card-bg rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-border">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">
                            Choose Your Story Elements
                        </h2>
                        <p className="text-text-secondary mt-1">
                            Select one option from each category to build your story
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-text-secondary hover:text-foreground"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Category Tabs */}
                <div className="flex border-b border-border">
                    {categories.map((category, index) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`flex-1 flex items-center justify-center py-4 px-6 text-sm font-medium transition-colors ${activeCategory === category.id
                                ? 'text-primary-accent border-b-2 border-primary-accent bg-primary-accent/10'
                                : 'text-text-secondary hover:text-foreground'
                                }`}
                        >
                            <span className="mr-2">{category.icon}</span>
                            {userSelections[category.id] ? (
                                <Check className="h-4 w-4 text-primary-accent mr-2" />
                            ) : null}
                            {category.title}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                    {currentCategoryData && (
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                {currentCategoryData.categoryTitle}
                            </h3>
                            <div className="space-y-4">
                                {currentCategoryData.options.map((option) => (
                                    <Card
                                        key={option.optionID}
                                        className={`p-4 cursor-pointer transition-all ${userSelections[activeCategory] === option.optionID
                                            ? 'border-primary-accent bg-primary-accent/10'
                                            : 'border-border hover:border-hover'
                                            }`}
                                        onClick={() => handleSelection(option)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-foreground mb-2">
                                                    {option.optionTitle}
                                                </h4>
                                                <div className="space-y-2">
                                                    {Object.entries(option.details).map(([key, value]) => (
                                                        <div key={key}>
                                                            <span className="text-sm font-medium text-text-secondary">
                                                                {key}:
                                                            </span>
                                                            <p className="text-sm text-text-secondary mt-1">
                                                                {value}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {userSelections[activeCategory] === option.optionID && (
                                                <Check className="h-5 w-5 text-primary-accent ml-4" />
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-border">
                    <div className="flex space-x-2">
                        {onBack && (
                            <Button
                                variant="outline"
                                onClick={onBack}
                                className="flex items-center"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Edit Idea
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className="flex items-center"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleNext}
                            disabled={currentIndex === categories.length - 1}
                            className="flex items-center"
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-text-secondary">
                            {Object.values(userSelections).filter(Boolean).length} of {categories.length} selected
                        </div>
                        <Button
                            onClick={onGenerateStory}
                            disabled={!isAllSelected || isLoading}
                            className="bg-primary-accent hover:bg-primary-accent/90 text-white"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Generating...
                                </div>
                            ) : (
                                'Generate Story'
                            )}
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="mx-6 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
