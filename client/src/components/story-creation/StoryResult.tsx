'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StoryResultSkeleton } from '@/components/ui/Skeleton';
import { Copy, Download, RotateCcw, BookOpen, Clock, FileText, Share2 } from 'lucide-react';
import type { StorymakerOutput } from '@/lib/api/types/story.types';

interface StoryResultProps {
    story: StorymakerOutput | null;
    isLoading?: boolean;
    onStartOver: () => void;
}

export function StoryResult({ story, isLoading, onStartOver }: StoryResultProps) {
    const [copied, setCopied] = useState(false);
    const [shared, setShared] = useState(false);

    const handleCopy = async () => {
        if (!story) return;
        try {
            await navigator.clipboard.writeText(story.storyContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const handleDownload = () => {
        if (!story) return;
        const element = document.createElement('a');
        const file = new Blob([story.storyContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${story.metadata.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleShare = async () => {
        if (!story) return;

        const shareData = {
            title: story.metadata.title,
            text: `Check out this story: "${story.metadata.title}"\n\n${story.storyContent.substring(0, 200)}...`,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                setShared(true);
                setTimeout(() => setShared(false), 2000);
            } else {
                // Fallback: Copy story summary to clipboard
                const shareText = `${story.metadata.title}\n\n${story.storyContent}`;
                await navigator.clipboard.writeText(shareText);
                setShared(true);
                setTimeout(() => setShared(false), 2000);
            }
        } catch (err) {
            console.error('Failed to share:', err);
        }
    };

    if (isLoading || !story) {
        return <StoryResultSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Story Header */}
            <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                            {story.metadata.title}
                        </h2>
                        <div className="flex items-center space-x-6 text-sm text-text-secondary">
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {story.metadata.estimatedReadTime}
                            </div>
                            <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-1" />
                                {story.metadata.wordCount.toLocaleString()} words
                            </div>
                            <div className="flex items-center">
                                <BookOpen className="h-4 w-4 mr-1" />
                                Generated {new Date(story.metadata.generatedOn).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            onClick={handleCopy}
                            className="flex items-center"
                        >
                            <Copy className="h-4 w-4 mr-1" />
                            {copied ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleShare}
                            className="flex items-center"
                        >
                            <Share2 className="h-4 w-4 mr-1" />
                            {shared ? 'Shared!' : 'Share'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleDownload}
                            className="flex items-center"
                        >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                        </Button>
                    </div>
                </div>

                {/* Story Blueprint */}
                <div className="bg-hover rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Story Blueprint</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-text-secondary">Protagonist:</span>
                            <p className="font-medium text-foreground">
                                {story.metadata.basedOnBlueprint.protagonist}
                            </p>
                        </div>
                        <div>
                            <span className="text-text-secondary">Conflict:</span>
                            <p className="font-medium text-foreground">
                                {story.metadata.basedOnBlueprint.conflict}
                            </p>
                        </div>
                        <div>
                            <span className="text-text-secondary">Stage:</span>
                            <p className="font-medium text-foreground">
                                {story.metadata.basedOnBlueprint.stage}
                            </p>
                        </div>
                        <div>
                            <span className="text-text-secondary">Soul:</span>
                            <p className="font-medium text-foreground">
                                {story.metadata.basedOnBlueprint.soul}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Story Content */}
            <Card className="p-6">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                        {story.storyContent}
                    </div>
                </div>
            </Card>

            {/* Actions */}
            <div className="flex justify-center space-x-4">
                <Button
                    onClick={onStartOver}
                    className="flex items-center bg-primary-accent hover:bg-primary-accent/90 text-white"
                >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Create Another Story
                </Button>
            </div>
        </div>
    );
}
