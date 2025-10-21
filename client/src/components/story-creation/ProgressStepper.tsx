'use client';

import { Check } from 'lucide-react';

interface Step {
    id: string;
    title: string;
    description: string;
}

interface ProgressStepperProps {
    currentStep: 'form' | 'menu' | 'result';
}

const steps: Step[] = [
    {
        id: 'form',
        title: 'Story Idea',
        description: 'Enter your concept',
    },
    {
        id: 'menu',
        title: 'Choose Elements',
        description: 'Select story components',
    },
    {
        id: 'result',
        title: 'Your Story',
        description: 'Read & share',
    },
];

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
    const currentIndex = steps.findIndex(step => step.id === currentStep);

    return (
        <div className="w-full max-w-3xl mx-auto mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isUpcoming = index > currentIndex;

                    return (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                {/* Step Circle */}
                                <div
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center
                                        transition-all duration-300 border-2
                                        ${isCompleted
                                            ? 'bg-primary-accent border-primary-accent text-white'
                                            : isCurrent
                                                ? 'bg-primary-accent/10 border-primary-accent text-primary-accent'
                                                : 'bg-card-bg border-border text-text-secondary'
                                        }
                                    `}
                                >
                                    {isCompleted ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <span className="text-sm font-semibold">{index + 1}</span>
                                    )}
                                </div>

                                {/* Step Label */}
                                <div className="text-center mt-2">
                                    <p
                                        className={`
                                            text-sm font-medium
                                            ${isCurrent || isCompleted
                                                ? 'text-foreground'
                                                : 'text-text-secondary'
                                            }
                                        `}
                                    >
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-text-secondary mt-0.5">
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`
                                        h-0.5 flex-1 mx-2 -mt-8
                                        transition-all duration-300
                                        ${isCompleted
                                            ? 'bg-primary-accent'
                                            : 'bg-border'
                                        }
                                    `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
