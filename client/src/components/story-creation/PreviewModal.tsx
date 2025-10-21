'use client';

import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { SummaryOutput, UserSelections } from '@/lib/api/types/story.types';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    menuData: SummaryOutput | null;
    userSelections: UserSelections;
    isLoading: boolean;
}

export function PreviewModal({
    isOpen,
    onClose,
    onConfirm,
    menuData,
    userSelections,
    isLoading,
}: PreviewModalProps) {
    if (!isOpen || !menuData) return null;

    const getOptionTitle = (categoryId: keyof UserSelections, optionId: string) => {
        const category = menuData.storyConstructionMenu.find(
            cat => cat.categoryID === categoryId
        );
        const option = category?.options.find(opt => opt.optionID === optionId);
        return option?.optionTitle || optionId;
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/75 flex items-center justify-center p-4 z-50">
            <div className="bg-card-bg rounded-lg shadow-xl max-w-2xl w-full border border-border">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center">
                        <Sparkles className="h-6 w-6 text-primary-accent mr-2" />
                        <h2 className="text-2xl font-bold text-foreground">
                            Ready to Generate Your Story
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-text-secondary hover:text-foreground"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-text-secondary">
                        Your story will be created based on these selections:
                    </p>

                    <div className="bg-hover rounded-lg p-4 space-y-3">
                        <div>
                            <span className="text-sm font-medium text-text-secondary">Core Idea:</span>
                            <p className="text-foreground mt-1">
                                {menuData.userInputAnalysis.coreIdea}
                            </p>
                        </div>

                        <div>
                            <span className="text-sm font-medium text-text-secondary">Length:</span>
                            <p className="text-foreground mt-1">
                                {menuData.userInputAnalysis.requestedLength} minute read
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary-accent/5 rounded-lg p-4 border border-primary-accent/20">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-2">👤</span>
                                <span className="text-sm font-medium text-text-secondary">Protagonist</span>
                            </div>
                            <p className="text-foreground font-medium">
                                {getOptionTitle('protagonist', userSelections.protagonist)}
                            </p>
                        </div>

                        <div className="bg-primary-accent/5 rounded-lg p-4 border border-primary-accent/20">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-2">⚔️</span>
                                <span className="text-sm font-medium text-text-secondary">Conflict</span>
                            </div>
                            <p className="text-foreground font-medium">
                                {getOptionTitle('conflict', userSelections.conflict)}
                            </p>
                        </div>

                        <div className="bg-primary-accent/5 rounded-lg p-4 border border-primary-accent/20">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-2">🌍</span>
                                <span className="text-sm font-medium text-text-secondary">Stage</span>
                            </div>
                            <p className="text-foreground font-medium">
                                {getOptionTitle('stage', userSelections.stage)}
                            </p>
                        </div>

                        <div className="bg-primary-accent/5 rounded-lg p-4 border border-primary-accent/20">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-2">💫</span>
                                <span className="text-sm font-medium text-text-secondary">Soul</span>
                            </div>
                            <p className="text-foreground font-medium">
                                {getOptionTitle('soul', userSelections.soul)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Go Back
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-primary-accent hover:bg-primary-accent/90 text-white"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Generating...
                            </div>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Generate My Story
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
