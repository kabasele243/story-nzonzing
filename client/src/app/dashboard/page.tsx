'use client';

import { useRouter } from 'next/navigation';
import { MainContent } from '@/components/layout/MainContent';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles, BookOpen, Clock, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();

  return (
    <MainContent
      title="Dashboard"
      description="Welcome to your AI-powered storytelling workspace"
    >
      <div className="space-y-6">
        {/* Hero Card */}
        <Card className="bg-gradient-to-br from-primary-accent/10 to-primary-accent/5 border-primary-accent/20">
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-accent/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Ready to Create?
                    </h2>
                    <p className="text-text-secondary">
                      Start with an idea, explore options, and generate your perfect story
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push('/create-story')}
                  className="bg-primary-accent hover:bg-primary-accent/90 text-white font-medium"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create New Story
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader
            title="How It Works"
            description="Create your story in three simple steps"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-hover rounded-lg border border-border">
              <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center mb-4">
                <span className="text-lg font-bold text-primary-accent">1</span>
              </div>
              <h3 className="font-bold text-foreground mb-2">Share Your Idea</h3>
              <p className="text-sm text-text-secondary">
                Enter your core story concept and choose the desired length
              </p>
            </div>

            <div className="p-6 bg-hover rounded-lg border border-border">
              <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center mb-4">
                <span className="text-lg font-bold text-primary-accent">2</span>
              </div>
              <h3 className="font-bold text-foreground mb-2">Choose Elements</h3>
              <p className="text-sm text-text-secondary">
                Select protagonist, conflict, setting, and theme from AI-generated options
              </p>
            </div>

            <div className="p-6 bg-hover rounded-lg border border-border">
              <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center mb-4">
                <span className="text-lg font-bold text-primary-accent">3</span>
              </div>
              <h3 className="font-bold text-foreground mb-2">Get Your Story</h3>
              <p className="text-sm text-text-secondary">
                Receive a complete, polished story ready to read, share, or download
              </p>
            </div>
          </div>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader
            title="What You Can Do"
            description="Powerful storytelling features at your fingertips"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-4 p-4 bg-hover rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-primary-accent/20 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-primary-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Multiple Lengths</h4>
                <p className="text-xs text-text-secondary">
                  Choose from 5, 10, 20, or 40-minute reading experiences
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-hover rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-primary-accent/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">AI-Powered Options</h4>
                <p className="text-xs text-text-secondary">
                  Get creative story elements tailored to your core idea
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-hover rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-primary-accent/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-primary-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Instant Results</h4>
                <p className="text-xs text-text-secondary">
                  Generate complete stories in seconds with professional quality
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MainContent>
  );
}
