'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainContent } from '@/components/layout/MainContent';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import {
  writeEpisode,
  SeriesContext,
  WriteEpisodeOutput,
  PreviousEpisodeSummary,
  SceneWithMultiAnglePrompts,
  ImagePrompt,
} from '@/lib/api';
import { CheckCircle2, Circle, Copy, Play, ArrowLeft, Image as ImageIcon, Camera } from 'lucide-react';

export default function EpisodeWriterPage() {
  const router = useRouter();
  const [seriesContext, setSeriesContext] = useState<SeriesContext | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [duration, setDuration] = useState<'5' | '10' | '30'>('10');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [writtenEpisodes, setWrittenEpisodes] = useState<Map<number, WriteEpisodeOutput>>(new Map());
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Expanding Episode Story', completed: currentStep > 0 },
    { label: 'Segmenting Scenes', completed: currentStep > 1 },
    { label: 'Generating Image Prompts', completed: currentStep > 2 },
  ];

  useEffect(() => {
    // Load series context from localStorage
    const storedSeries = localStorage.getItem('currentSeries');
    if (storedSeries) {
      try {
        const parsed = JSON.parse(storedSeries);
        setSeriesContext(parsed);
      } catch (err) {
        console.error('Failed to parse stored series:', err);
      }
    }

    // Load written episodes from localStorage
    const storedEpisodes = localStorage.getItem('writtenEpisodes');
    if (storedEpisodes) {
      try {
        const parsed = JSON.parse(storedEpisodes);
        setWrittenEpisodes(new Map(Object.entries(parsed).map(([k, v]) => [parseInt(k), v as WriteEpisodeOutput])));
      } catch (err) {
        console.error('Failed to parse stored episodes:', err);
      }
    }
  }, []);

  const handleWriteEpisode = async () => {
    if (!seriesContext) {
      setError('No series context found. Please create a series first.');
      return;
    }

    setLoading(true);
    setError('');
    setCurrentStep(0);

    try {
      // Build previous episodes summaries
      const previousEpisodes: PreviousEpisodeSummary[] = [];
      for (let i = 1; i < selectedEpisode; i++) {
        const episode = writtenEpisodes.get(i);
        if (episode) {
          // Create a summary from the full episode (first 500 characters)
          const summary = episode.fullEpisode.substring(0, 500) + '...';
          previousEpisodes.push({
            episodeNumber: i,
            title: episode.episodeTitle,
            summary,
          });
        }
      }

      // Simulate step progression
      const progressInterval = setInterval(() => {
        setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 5000);

      const output = await writeEpisode({
        seriesContext,
        episodeNumber: selectedEpisode,
        duration,
        previousEpisodes: previousEpisodes.length > 0 ? previousEpisodes : undefined,
      });

      clearInterval(progressInterval);
      setCurrentStep(3);

      // Store the written episode
      const newWrittenEpisodes = new Map(writtenEpisodes);
      newWrittenEpisodes.set(selectedEpisode, output);
      setWrittenEpisodes(newWrittenEpisodes);

      // Save to localStorage
      const episodesObj = Object.fromEntries(newWrittenEpisodes);
      localStorage.setItem('writtenEpisodes', JSON.stringify(episodesObj));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCurrentStep(0);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getDurationWords = (dur: string) => {
    const minutes = parseInt(dur);
    return minutes * 150;
  };

  const currentEpisodeData = writtenEpisodes.get(selectedEpisode);

  if (!seriesContext) {
    return (
      <MainContent title="Episode Writer" description="Write individual episodes for your series">
        <Card className="text-center py-12">
          <p className="text-text-secondary mb-4">No series found. Please create a series first.</p>
          <Button onClick={() => router.push('/series-creator')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Create Series
          </Button>
        </Card>
      </MainContent>
    );
  }

  return (
    <MainContent
      title={`${seriesContext.seriesTitle} - Episode Writer`}
      description="Write and manage individual episodes"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Episode Selector Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader title="Episodes" description="Select episode to write" />
            <div className="space-y-2">
              {seriesContext.episodeOutlines.map((outline) => {
                const isWritten = writtenEpisodes.has(outline.episodeNumber);
                return (
                  <button
                    key={outline.episodeNumber}
                    onClick={() => setSelectedEpisode(outline.episodeNumber)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedEpisode === outline.episodeNumber
                      ? 'border-primary-accent bg-primary-accent/20'
                      : 'border-border bg-hover hover:border-primary-accent/50'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-foreground">
                        Episode {outline.episodeNumber}
                      </span>
                      {isWritten && <CheckCircle2 className="w-4 h-4 text-success" />}
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-2">{outline.title}</p>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="mt-6">
            <CardHeader title="Episode Settings" />
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Episode Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['5', '10', '30'] as const).map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setDuration(dur)}
                      className={`px-2 py-2 rounded-lg border transition-colors ${duration === dur
                        ? 'border-primary-accent bg-primary-accent/20 text-primary-accent'
                        : 'border-border bg-hover text-text-secondary hover:border-primary-accent/50'
                        }`}
                    >
                      <div className="font-semibold text-xs">{dur}m</div>
                      <div className="text-[10px]">~{getDurationWords(dur)}w</div>
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="text-xs text-red-500 p-2 bg-red-500/10 rounded">{error}</div>}

              <Button
                onClick={handleWriteEpisode}
                loading={loading}
                disabled={loading}
                className="w-full flex items-center justify-center"
              >
                <Play className="w-4 h-4 mr-2" />
                {currentEpisodeData ? 'Rewrite Episode' : 'Write Episode'}
              </Button>
            </div>
          </Card>

          {loading && (
            <Card className="mt-6">
              <CardHeader title="Progress" />
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : currentStep === idx ? (
                      <div className="w-4 h-4 border-2 border-primary-accent border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Circle className="w-4 h-4 text-border" />
                    )}
                    <span className={`text-xs ${step.completed ? 'text-foreground' : 'text-text-secondary'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {currentEpisodeData ? (
            <Tabs
              tabs={[
                {
                  id: 'episode',
                  label: 'Full Episode',
                  content: <EpisodeView episode={currentEpisodeData} onCopy={copyToClipboard} />,
                },
                {
                  id: 'scenes',
                  label: 'Scenes & Prompts',
                  content: <ScenesView scenes={currentEpisodeData.scenesWithPrompts} onCopy={copyToClipboard} />,
                },
              ]}
            />
          ) : (
            <Card className="text-center py-12">
              <Play className="w-16 h-16 text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary mb-2">
                Select an episode and click &quot;Write Episode&quot; to begin
              </p>
              <p className="text-xs text-text-secondary">
                {writtenEpisodes.size} of {seriesContext.totalEpisodes} episodes written
              </p>
            </Card>
          )}
        </div>
      </div>
    </MainContent>
  );
}

function EpisodeView({ episode, onCopy }: { episode: WriteEpisodeOutput; onCopy: (text: string) => void }) {
  const wordCount = episode.fullEpisode ? episode.fullEpisode.split(' ').filter(Boolean).length : 0;

  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <CardHeader title={episode.episodeTitle} description={`Episode ${episode.episodeNumber} • ${wordCount} words`} />
        <Button variant="secondary" onClick={() => onCopy(episode.fullEpisode)}>
          <Copy className="w-4 h-4" />
        </Button>
      </div>
      <div className="prose prose-invert max-w-none">
        <p className="text-foreground whitespace-pre-wrap leading-relaxed">{episode.fullEpisode}</p>
      </div>
    </Card>
  );
}

function ScenesView({
  scenes,
  onCopy,
}: {
  scenes: SceneWithMultiAnglePrompts[];
  onCopy: (text: string) => void;
}) {
  return (
    <div className="space-y-6">
      {scenes.map((scene) => (
        <Card key={scene.sceneNumber}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Scene {scene.sceneNumber}
              </h4>
              <p className="text-sm text-text-secondary">{scene.setting}</p>
            </div>
            <div className="text-xs text-text-secondary">
              {scene.charactersPresent.join(', ')}
            </div>
          </div>

          <p className="text-sm text-foreground mb-4">{scene.description}</p>

          <div className="border-t border-border pt-4">
            <h5 className="text-sm font-semibold text-primary-accent mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Image Prompts ({scene.imagePrompts.length} angles)
            </h5>
            <div className="space-y-3">
              {scene.imagePrompts.map((prompt, idx) => (
                <ImagePromptCard key={idx} prompt={prompt} onCopy={onCopy} />
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ImagePromptCard({ prompt, onCopy }: { prompt: ImagePrompt; onCopy: (text: string) => void }) {
  const typeColors: Record<string, string> = {
    main: 'bg-blue-500/20 text-blue-400',
    'close-up': 'bg-purple-500/20 text-purple-400',
    'wide-shot': 'bg-green-500/20 text-green-400',
    'over-shoulder': 'bg-yellow-500/20 text-yellow-400',
    'dutch-angle': 'bg-pink-500/20 text-pink-400',
    'birds-eye': 'bg-cyan-500/20 text-cyan-400',
  };

  return (
    <div className="bg-hover p-3 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${typeColors[prompt.type] || 'bg-gray-500/20'}`}>
            {prompt.type}
          </span>
          <span className="text-xs text-text-secondary">{prompt.description}</span>
        </div>
        <Button variant="secondary" onClick={() => onCopy(prompt.prompt)} className="!p-1">
          <Copy className="w-3 h-3" />
        </Button>
      </div>
      <p className="text-xs text-foreground leading-relaxed">{prompt.prompt}</p>
    </div>
  );
}
