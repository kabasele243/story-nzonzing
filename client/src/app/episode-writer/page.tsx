'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
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
  fetchSeriesWithEpisodes,
  fetchUserSeries,
} from '@/lib/api';
import { CheckCircle2, Circle, Copy, Play, Image as ImageIcon, Camera, Film } from 'lucide-react';
import { useSeriesStore } from '@/stores/useSeriesStore';
import { useEpisodeStore } from '@/stores/useEpisodeStore';

export default function EpisodeWriterPage() {
  const router = useRouter();
  const { getToken, isSignedIn } = useAuth();

  // Zustand stores
  const { currentSeriesId, seriesList, setSeriesList, setCurrentSeries } = useSeriesStore();
  const { addEpisode, setEpisodesForSeries } = useEpisodeStore();

  const [seriesContext, setSeriesContext] = useState<SeriesContext | null>(null);
  const [activeSeriesId, setActiveSeriesId] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [duration, setDuration] = useState<'5' | '10' | '30'>('10');
  const [loading, setLoading] = useState(false);
  const [loadingSeries, setLoadingSeries] = useState(false);
  const [error, setError] = useState('');
  const [writtenEpisodes, setWrittenEpisodes] = useState<Map<number, WriteEpisodeOutput>>(new Map());
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Expanding Episode Story', completed: currentStep > 0 },
    { label: 'Segmenting Scenes', completed: currentStep > 1 },
    { label: 'Generating Image Prompts', completed: currentStep > 2 },
  ];

  // Fetch all user's series on mount
  useEffect(() => {
    const loadAllSeries = async () => {
      if (isSignedIn) {
        try {
          setLoadingSeries(true);
          const token = await getToken();
          if (token) {
            const series = await fetchUserSeries(token);
            setSeriesList(series);

            // If currentSeriesId exists, use it; otherwise use the first series
            if (currentSeriesId) {
              setActiveSeriesId(currentSeriesId);
            } else if (series.length > 0) {
              setActiveSeriesId(series[0].id);
            }
          }
        } catch (err) {
          console.error('Failed to load user series:', err);
          setError('Failed to load series. Please try again.');
        } finally {
          setLoadingSeries(false);
        }
      }
    };

    loadAllSeries();
  }, [isSignedIn, getToken, setSeriesList, currentSeriesId]);

  // Load selected series and its episodes when activeSeriesId changes
  useEffect(() => {
    if (!activeSeriesId) return;

    const loadSeriesData = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        if (token) {
          const data = await fetchSeriesWithEpisodes(activeSeriesId, token);

          // Set series context
          setSeriesContext({
            seriesTitle: data.series.seriesTitle,
            seriesDescription: data.series.seriesDescription,
            tagline: data.series.tagline,
            themes: data.series.themes,
            masterCharacters: data.series.masterCharacters,
            episodeOutlines: data.series.episodeOutlines,
            plotThreads: data.series.plotThreads,
            totalEpisodes: data.series.totalEpisodes,
          });

          // Update Zustand store
          setCurrentSeries({
            seriesTitle: data.series.seriesTitle,
            seriesDescription: data.series.seriesDescription,
            tagline: data.series.tagline,
            themes: data.series.themes,
            masterCharacters: data.series.masterCharacters,
            episodeOutlines: data.series.episodeOutlines,
            plotThreads: data.series.plotThreads,
            totalEpisodes: data.series.totalEpisodes,
          }, activeSeriesId);

          // Store episodes in Zustand
          setEpisodesForSeries(activeSeriesId, data.episodes);

          // Update local episodes map
          const episodesMap = new Map<number, WriteEpisodeOutput>();
          data.episodes.forEach((ep) => {
            episodesMap.set(ep.episode_number, {
              seriesTitle: ep.seriesTitle,
              episodeNumber: ep.episodeNumber,
              episodeTitle: ep.episodeTitle,
              fullEpisode: ep.fullEpisode,
              scenesWithPrompts: ep.scenesWithPrompts,
            });
          });
          setWrittenEpisodes(episodesMap);
        }
      } catch (err) {
        console.error('Failed to load series data:', err);
        setError('Failed to load series data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadSeriesData();
  }, [activeSeriesId, getToken, setEpisodesForSeries, setCurrentSeries]);

  const handleWriteEpisode = async () => {
    if (!isSignedIn) {
      setError('Please sign in to write an episode');
      return;
    }

    if (!seriesContext) {
      setError('No series selected. Please select a series first.');
      return;
    }

    if (!activeSeriesId) {
      setError('No series selected. Please select a series first.');
      return;
    }

    setLoading(true);
    setError('');
    setCurrentStep(0);

    try {
      // Get authentication token from Clerk
      const token = await getToken();

      if (!token) {
        throw new Error('Failed to get authentication token. Please sign in again.');
      }

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
        seriesId: activeSeriesId,
        seriesContext,
        episodeNumber: selectedEpisode,
        duration,
        previousEpisodes: previousEpisodes.length > 0 ? previousEpisodes : undefined,
      }, token);

      clearInterval(progressInterval);
      setCurrentStep(3);

      // Store the written episode locally
      const newWrittenEpisodes = new Map(writtenEpisodes);
      newWrittenEpisodes.set(selectedEpisode, output);
      setWrittenEpisodes(newWrittenEpisodes);

      // Store in Zustand store (synced with database)
      if (output.episodeId) {
        addEpisode(activeSeriesId, {
          id: output.episodeId,
          series_id: activeSeriesId,
          clerk_user_id: '', // Will be populated from server
          episode_number: selectedEpisode,
          seriesTitle: output.seriesTitle,
          episodeNumber: output.episodeNumber,
          episodeTitle: output.episodeTitle,
          fullEpisode: output.fullEpisode,
          scenesWithPrompts: output.scenesWithPrompts,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
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

  return (
    <MainContent
      title="Episode Writer"
      description="Write and manage individual episodes"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Episode Selector Sidebar */}
        <div className="lg:col-span-1">
          {/* Series Selector */}
          <Card>
            <CardHeader title="Select Series" description="Choose which series to write" />
            <div className="space-y-2">
              {loadingSeries ? (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-primary-accent border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-text-secondary mt-2">Loading series...</p>
                </div>
              ) : seriesList.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-text-secondary mb-3">No series found</p>
                  <Button onClick={() => router.push('/series-creator')} className="text-sm">
                    <Film className="w-4 h-4 mr-2" />
                    Create Series
                  </Button>
                </div>
              ) : (
                <select
                  value={activeSeriesId || ''}
                  onChange={(e) => setActiveSeriesId(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:border-primary-accent focus:outline-none"
                >
                  {seriesList.map((series) => (
                    <option key={series.id} value={series.id}>
                      {series.seriesTitle}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </Card>

          <Card className="mt-6">
            <CardHeader title="Episodes" description="Select episode to write" />
            <div className="space-y-2">
              {!seriesContext || loading ? (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-primary-accent border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-text-secondary mt-2">Loading episodes...</p>
                </div>
              ) : seriesContext.episodeOutlines && seriesContext.episodeOutlines.length > 0 ? (
                seriesContext.episodeOutlines.map((outline) => {
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
                })
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-text-secondary">No episodes found</p>
                </div>
              )}
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
              {seriesContext && (
                <p className="text-xs text-text-secondary">
                  {writtenEpisodes.size} of {seriesContext.totalEpisodes} episodes written
                </p>
              )}
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
