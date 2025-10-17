import Link from 'next/link';
import { MainContent } from '@/components/layout/MainContent';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Layers, Sparkles, Image, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <MainContent
      title="Story Pipeline Dashboard"
      description="Welcome to your AI-powered storytelling workspace"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:border-primary-accent transition-colors cursor-pointer">
          <Link href="/complete-pipeline">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-accent/20 flex items-center justify-center flex-shrink-0">
                <Layers className="w-6 h-6 text-primary-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-2">Complete Pipeline</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Transform a summary into a full story with characters, scenes, and image prompts
                </p>
                <div className="flex items-center text-primary-accent text-sm font-semibold">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          </Link>
        </Card>

        <Card className="hover:border-primary-accent transition-colors cursor-pointer">
          <Link href="/story-expander">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-accent/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-primary-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-2">Story Expander</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Expand a 200-word summary into a rich 2000-word narrative
                </p>
                <div className="flex items-center text-primary-accent text-sm font-semibold">
                  Try It <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          </Link>
        </Card>

        <Card className="hover:border-primary-accent transition-colors cursor-pointer">
          <Link href="/scene-generator">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-accent/20 flex items-center justify-center flex-shrink-0">
                <Image className="w-6 h-6 text-primary-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-2">Scene Generator</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Extract characters and generate scene prompts from a full story
                </p>
                <div className="flex items-center text-primary-accent text-sm font-semibold">
                  Explore <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          </Link>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Getting Started"
          description="Learn how to use the Story Pipeline"
        />
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary-accent text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Start with a Summary</h4>
              <p className="text-sm text-text-secondary">
                Write a brief 200-word story summary describing your plot, characters, and setting
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary-accent text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Generate Full Story</h4>
              <p className="text-sm text-text-secondary">
                The AI expands your summary into a rich 2000-word narrative with vivid descriptions and dialogue
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary-accent text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Get Scenes & Prompts</h4>
              <p className="text-sm text-text-secondary">
                Extract character profiles, scene breakdowns, and detailed image generation prompts
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <Link href="/complete-pipeline">
            <Button className="w-full flex items-center justify-center">
              <Layers className="w-4 h-4 mr-2" />
              Try Complete Pipeline
            </Button>
          </Link>
        </div>
      </Card>
    </MainContent>
  );
}
