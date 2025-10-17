'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MainContent } from '@/components/layout/MainContent';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Layers,
  Sparkles,
  Image,
  ArrowRight,
  Film,
  Play,
  BookOpen,
  Users,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SeriesContext, WriteEpisodeOutput } from '@/lib/api';

interface SeriesInProgress {
  seriesContext: SeriesContext;
  writtenEpisodes: { [key: number]: WriteEpisodeOutput };
}

export default function Home() {
  const router = useRouter();
  const [seriesInProgress, setSeriesInProgress] = useState<SeriesInProgress | null>(null);
  const [writtenEpisodesCount, setWrittenEpisodesCount] = useState(0);
  const [showAllTools, setShowAllTools] = useState(false);

  useEffect(() => {
    // Load current series from localStorage
    const storedSeries = localStorage.getItem('currentSeries');
    const storedEpisodes = localStorage.getItem('writtenEpisodes');

    if (storedSeries) {
      try {
        const seriesContext = JSON.parse(storedSeries);
        const episodes = storedEpisodes ? JSON.parse(storedEpisodes) : {};
        setSeriesInProgress({ seriesContext, writtenEpisodes: episodes });
        setWrittenEpisodesCount(Object.keys(episodes).length);
      } catch (err) {
        console.error('Failed to load series data:', err);
      }
    }
  }, []);

  const getNextEpisodeToWrite = (): number | null => {
    if (!seriesInProgress) return null;

    for (let i = 1; i <= seriesInProgress.seriesContext.totalEpisodes; i++) {
      if (!seriesInProgress.writtenEpisodes[i]) {
        return i;
      }
    }
    return null;
  };

  const nextEpisode = getNextEpisodeToWrite();

  return (
    <MainContent
      title="Dashboard"
      description={seriesInProgress ? `Welcome back! You have work in progress` : 'Welcome to your AI-powered storytelling workspace'}
    >
      <div className="space-y-6">
        {/* Continue Working Section */}
        {seriesInProgress && (
          <Card>
            <CardHeader
              title="Continue Working"
              description="Pick up where you left off"
            />
            <div className="space-y-4">
              <div className="p-4 bg-hover rounded-lg border border-border hover:border-primary-accent transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Film className="w-5 h-5 text-primary-accent" />
                      <h3 className="font-bold text-foreground text-lg">
                        {seriesInProgress.seriesContext.seriesTitle}
                      </h3>
                    </div>
                    <p className="text-sm text-text-secondary mb-3">
                      {seriesInProgress.seriesContext.tagline}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                      <span>
                        {writtenEpisodesCount} of {seriesInProgress.seriesContext.totalEpisodes} episodes written
                      </span>
                      {nextEpisode && (
                        <span className="text-primary-accent font-semibold">
                          Next: Episode {nextEpisode}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => router.push('/series-creator')}
                    >
                      View Series
                    </Button>
                    {nextEpisode && (
                      <Button onClick={() => router.push('/episode-writer')} className='flex items-center'>
                        <Play className="w-4 h-4 mr-2" />
                        Continue
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Create Something New Section */}
        <Card>
          <CardHeader
            title="Create Something New"
            description="Choose a workflow to start creating"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/series-creator')}
              className="p-6 bg-hover hover:bg-primary-accent/10 border-2 border-border hover:border-primary-accent rounded-lg transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-accent/20 flex items-center justify-center mb-4 group-hover:bg-primary-accent/30 transition-colors">
                <Film className="w-6 h-6 text-primary-accent" />
              </div>
              <h3 className="font-bold text-foreground mb-2">New Series</h3>
              <p className="text-sm text-text-secondary">
                Multi-episode storytelling with continuity
              </p>
            </button>

            <button
              onClick={() => router.push('/complete-pipeline')}
              className="p-6 bg-hover hover:bg-primary-accent/10 border-2 border-border hover:border-primary-accent rounded-lg transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-accent/20 flex items-center justify-center mb-4 group-hover:bg-primary-accent/30 transition-colors">
                <Layers className="w-6 h-6 text-primary-accent" />
              </div>
              <h3 className="font-bold text-foreground mb-2">New Story</h3>
              <p className="text-sm text-text-secondary">
                Full story with scenes and prompts
              </p>
            </button>

            <button
              onClick={() => router.push('/story-expander')}
              className="p-6 bg-hover hover:bg-primary-accent/10 border-2 border-border hover:border-primary-accent rounded-lg transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-accent/20 flex items-center justify-center mb-4 group-hover:bg-primary-accent/30 transition-colors">
                <Sparkles className="w-6 h-6 text-primary-accent" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Expand Text</h3>
              <p className="text-sm text-text-secondary">
                Turn a summary into a full narrative
              </p>
            </button>

            <button
              onClick={() => router.push('/scene-generator')}
              className="p-6 bg-hover hover:bg-primary-accent/10 border-2 border-border hover:border-primary-accent rounded-lg transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-accent/20 flex items-center justify-center mb-4 group-hover:bg-primary-accent/30 transition-colors">
                <Image className="w-6 h-6 text-primary-accent" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Generate Scenes</h3>
              <p className="text-sm text-text-secondary">
                Break a story into visual scenes
              </p>
            </button>
          </div>
        </Card>

        {/* Stats Section */}
        {/* {seriesInProgress && (
          <Card>
            <CardHeader title="Your Creative Stats" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-hover rounded-lg">
                <Film className="w-6 h-6 text-primary-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">1</div>
                <div className="text-xs text-text-secondary">Series</div>
              </div>
              <div className="text-center p-4 bg-hover rounded-lg">
                <Play className="w-6 h-6 text-primary-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{writtenEpisodesCount}</div>
                <div className="text-xs text-text-secondary">Episodes</div>
              </div>
              <div className="text-center p-4 bg-hover rounded-lg">
                <Users className="w-6 h-6 text-primary-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {seriesInProgress.seriesContext.masterCharacters?.length}
                </div>
                <div className="text-xs text-text-secondary">Characters</div>
              </div>
              <div className="text-center p-4 bg-hover rounded-lg">
                <BookOpen className="w-6 h-6 text-primary-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {seriesInProgress.seriesContext.plotThreads.length}
                </div>
                <div className="text-xs text-text-secondary">Plot Threads</div>
              </div>
            </div>
          </Card>
        )} */}

        {/* All Tools Section (Expandable) */}
        <Card>
          <button
            onClick={() => setShowAllTools(!showAllTools)}
            className="w-full flex items-center justify-between p-4 hover:bg-hover transition-colors rounded-lg"
          >
            <div className="text-left">
              <h3 className="font-bold text-foreground">All Workflows & Tools</h3>
              <p className="text-sm text-text-secondary">Explore all available storytelling tools</p>
            </div>
            {showAllTools ? (
              <ChevronUp className="w-5 h-5 text-text-secondary" />
            ) : (
              <ChevronDown className="w-5 h-5 text-text-secondary" />
            )}
          </button>

          {showAllTools && (
            <div className="px-4 pb-4 space-y-3 mt-4 border-t border-border pt-4">
              <Link href="/series-creator">
                <div className="flex items-center gap-4 p-4 bg-hover hover:bg-primary-accent/10 rounded-lg transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-primary-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-accent/30">
                    <Film className="w-5 h-5 text-primary-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">Series Creator</h4>
                    <p className="text-xs text-text-secondary">
                      Create multi-episode series with consistent characters and plot threads
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-primary-accent" />
                </div>
              </Link>

              <Link href="/episode-writer">
                <div className="flex items-center gap-4 p-4 bg-hover hover:bg-primary-accent/10 rounded-lg transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-primary-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-accent/30">
                    <Play className="w-5 h-5 text-primary-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">Episode Writer</h4>
                    <p className="text-xs text-text-secondary">
                      Write individual episodes with full continuity and multi-angle image prompts
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-primary-accent" />
                </div>
              </Link>

              <Link href="/complete-pipeline">
                <div className="flex items-center gap-4 p-4 bg-hover hover:bg-primary-accent/10 rounded-lg transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-primary-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-accent/30">
                    <Layers className="w-5 h-5 text-primary-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">Complete Pipeline</h4>
                    <p className="text-xs text-text-secondary">
                      Transform a summary into a full story with characters, scenes, and image prompts
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-primary-accent" />
                </div>
              </Link>

              <Link href="/story-expander">
                <div className="flex items-center gap-4 p-4 bg-hover hover:bg-primary-accent/10 rounded-lg transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-primary-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-accent/30">
                    <Sparkles className="w-5 h-5 text-primary-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">Story Expander</h4>
                    <p className="text-xs text-text-secondary">
                      Expand a brief summary into a rich narrative with customizable duration
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-primary-accent" />
                </div>
              </Link>

              <Link href="/scene-generator">
                <div className="flex items-center gap-4 p-4 bg-hover hover:bg-primary-accent/10 rounded-lg transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-primary-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-accent/30">
                    <Image className="w-5 h-5 text-primary-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">Scene Generator</h4>
                    <p className="text-xs text-text-secondary">
                      Extract characters and generate scene breakdowns with image prompts from any story
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-primary-accent" />
                </div>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </MainContent>
  );
}
