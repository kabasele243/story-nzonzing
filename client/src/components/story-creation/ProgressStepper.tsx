'use client';

import { motion } from 'framer-motion';
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
        <div className="w-full max-w-3xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isUpcoming = index > currentIndex;

                    return (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                {/* Step Circle */}
                                <motion.div
                                    className={`
                                        w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                                        transition-all duration-300 border-2
                                        ${isCompleted
                                            ? 'bg-primary-accent border-primary-accent text-white'
                                            : isCurrent
                                                ? 'bg-primary-accent/10 border-primary-accent text-primary-accent'
                                                : 'bg-card-bg border-border text-text-secondary'
                                        }
                                    `}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {isCompleted ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 200 }}
                                        >
                                            <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </motion.div>
                                    ) : (
                                        <span className="text-xs sm:text-sm font-semibold">{index + 1}</span>
                                    )}
                                </motion.div>

                                {/* Step Label */}
                                <motion.div
                                    className="text-center mt-1 sm:mt-2"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 0.1 }}
                                >
                                    <p
                                        className={`
                                            text-xs sm:text-sm font-medium
                                            ${isCurrent || isCompleted
                                                ? 'text-foreground'
                                                : 'text-text-secondary'
                                            }
                                        `}
                                    >
                                        {step.title}
                                    </p>
                                    <p className="hidden sm:block text-xs text-text-secondary mt-0.5">
                                        {step.description}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="relative flex-1 mx-1 sm:mx-2 -mt-6 sm:-mt-8">
                                    <div className="h-0.5 w-full bg-border" />
                                    <motion.div
                                        className="absolute top-0 left-0 h-0.5 bg-primary-accent"
                                        initial={{ width: '0%' }}
                                        animate={{ width: isCompleted ? '100%' : '0%' }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
