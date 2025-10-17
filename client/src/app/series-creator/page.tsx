'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainContent } from '@/components/layout/MainContent';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { createSeries, SeriesContext, MasterCharacter, EpisodeOutline, PlotThread } from '@/lib/api';
import { CheckCircle2, Circle, Film, Users, BookOpen, Sparkles } from 'lucide-react';

const EXAMPLE_SUMMARIES = [
  "In a dystopian future where memories can be extracted and sold, a rogue memory dealer discovers that some memories are being artificially created to control society. As they dig deeper, they uncover a conspiracy that threatens to rewrite humanity's entire history.",
  "A group of teenagers in a small coastal town discover they can manipulate time, but only during the hours between midnight and 3 AM. They must use this power to prevent a catastrophic event while dealing with the consequences of altering the timeline.",
];

export default function SeriesCreatorPage() {
  const router = useRouter();
  const [summary, setSummary] = useState('');
  const [numberOfEpisodes, setNumberOfEpisodes] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seriesContext, setSeriesContext] = useState<SeriesContext | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Generating Series Metadata', completed: currentStep > 0 },
    { label: 'Creating Master Characters', completed: currentStep > 1 },
    { label: 'Outlining Episodes', completed: currentStep > 2 },
    { label: 'Identifying Plot Threads', completed: currentStep > 3 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) {
      setError('Please enter a story summary');
      return;
    }

    setLoading(true);
    setError('');
    setSeriesContext(null);
    setCurrentStep(0);

    try {
      // Simulate step progression
      const progressInterval = setInterval(() => {
        setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 4000);

      const output = await createSeries({
        storySummary: summary,
        numberOfEpisodes,
      });

      clearInterval(progressInterval);
      setCurrentStep(4);
      setSeriesContext(output.seriesContext);

      // Store series context in localStorage
      localStorage.setItem('currentSeries', JSON.stringify(output.seriesContext));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCurrentStep(0);
    } finally {
      setLoading(false);
    }
  };

  const handleWriteEpisodes = () => {
    if (seriesContext) {
      router.push('/episode-writer');
    }
  };

  return (
    <MainContent
      title="Series Creator"
      description="Transform a story summary into a complete series with characters, episodes, and plot threads"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader
              title="Series Setup"
              description="Create your series structure"
            />
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Number of Episodes</label>
                <div className="flex gap-2">
                  {[3, 5, 8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNumberOfEpisodes(num)}
                      className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                        numberOfEpisodes === num
                          ? 'border-primary-accent bg-primary-accent/20 text-primary-accent font-semibold'
                          : 'border-border bg-hover text-text-secondary hover:border-primary-accent/50'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={numberOfEpisodes}
                  onChange={(e) => setNumberOfEpisodes(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
                  placeholder="Or enter custom number"
                />
              </div>

              <Input
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Enter your series premise..."
                rows={8}
                error={error}
              />

              <div className="space-y-2">
                <p className="text-xs text-text-secondary">Try an example:</p>
                {EXAMPLE_SUMMARIES.map((example, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSummary(example)}
                    className="w-full text-left text-xs text-text-secondary hover:text-primary-accent p-2 rounded bg-hover transition-colors"
                  >
                    {example.substring(0, 100)}...
                  </button>
                ))}
              </div>

              <Button type="submit" loading={loading} className="w-full flex items-center justify-center">
                <Film className="w-4 h-4 mr-2" />
                {loading ? 'Creating Series...' : 'Create Series'}
              </Button>
            </form>
          </Card>

          {loading && (
            <Card className="mt-6">
              <CardHeader title="Progress" />
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : currentStep === idx ? (
                      <div className="w-5 h-5 border-2 border-primary-accent border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Circle className="w-5 h-5 text-border" />
                    )}
                    <span className={step.completed ? 'text-foreground' : 'text-text-secondary'}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          {seriesContext && (
            <>
              <Tabs
                tabs={[
                  {
                    id: 'overview',
                    label: 'Overview',
                    content: <OverviewView seriesContext={seriesContext} />,
                  },
                  {
                    id: 'characters',
                    label: 'Characters',
                    content: <CharactersView characters={seriesContext.masterCharacters} />,
                  },
                  {
                    id: 'episodes',
                    label: 'Episodes',
                    content: <EpisodesView episodes={seriesContext.episodeOutlines} />,
                  },
                  {
                    id: 'plot-threads',
                    label: 'Plot Threads',
                    content: <PlotThreadsView plotThreads={seriesContext.plotThreads} />,
                  },
                ]}
              />

              <Card className="mt-6">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-foreground mb-2">Ready to Write Episodes?</h3>
                  <p className="text-sm text-text-secondary mb-4">
                    Your series structure is complete. Now you can write individual episodes with full continuity.
                  </p>
                  <Button onClick={handleWriteEpisodes} className="flex items-center justify-center mx-auto">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Writing Episodes
                  </Button>
                </div>
              </Card>
            </>
          )}

          {!seriesContext && !loading && (
            <Card className="text-center py-12">
              <Film className="w-16 h-16 text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary">
                Enter a series summary to get started
              </p>
            </Card>
          )}
        </div>
      </div>
    </MainContent>
  );
}

function OverviewView({ seriesContext }: { seriesContext: SeriesContext }) {
  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{seriesContext.seriesTitle}</h2>
          <p className="text-primary-accent italic mb-4">&quot;{seriesContext.tagline}&quot;</p>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">{seriesContext.seriesDescription}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Themes</h3>
          <div className="flex flex-wrap gap-2">
            {seriesContext.themes.map((theme, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-primary-accent/20 text-primary-accent rounded-full text-sm"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-hover rounded-lg">
            <div className="text-2xl font-bold text-primary-accent">{seriesContext.totalEpisodes}</div>
            <div className="text-xs text-text-secondary">Episodes</div>
          </div>
          <div className="text-center p-4 bg-hover rounded-lg">
            <div className="text-2xl font-bold text-primary-accent">{seriesContext.masterCharacters.length}</div>
            <div className="text-xs text-text-secondary">Characters</div>
          </div>
          <div className="text-center p-4 bg-hover rounded-lg">
            <div className="text-2xl font-bold text-primary-accent">{seriesContext.plotThreads.length}</div>
            <div className="text-xs text-text-secondary">Plot Threads</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function CharactersView({ characters }: { characters: MasterCharacter[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {characters.map((character, idx) => (
        <Card key={idx}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-primary-accent" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-foreground">{character.name}</h4>
                <span className="px-2 py-0.5 bg-hover text-text-secondary text-xs rounded">
                  {character.role}
                </span>
              </div>
              <p className="text-sm text-text-secondary mb-2">{character.description}</p>
              <p className="text-sm text-foreground mb-2">{character.keyTraits}</p>
              <div className="text-xs text-text-secondary bg-hover p-2 rounded">
                <strong>Visual:</strong> {character.visualAnchorPrompt}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function EpisodesView({ episodes }: { episodes: EpisodeOutline[] }) {
  return (
    <div className="space-y-4">
      {episodes.map((episode) => (
        <Card key={episode.episodeNumber}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-primary-accent">{episode.episodeNumber}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-foreground mb-2">{episode.title}</h4>
              <p className="text-sm text-text-secondary mb-3">{episode.synopsis}</p>

              <div className="mb-2">
                <h5 className="text-xs font-semibold text-foreground mb-1">Key Events:</h5>
                <ul className="text-xs text-text-secondary space-y-1">
                  {episode.keyEvents.map((event, idx) => (
                    <li key={idx}>• {event}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-text-secondary">Characters:</span>
                {episode.charactersInvolved.map((char, idx) => (
                  <span key={idx} className="text-xs bg-hover text-foreground px-2 py-0.5 rounded">
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function PlotThreadsView({ plotThreads }: { plotThreads: PlotThread[] }) {
  return (
    <div className="space-y-4">
      {plotThreads.map((thread, idx) => (
        <Card key={idx}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-primary-accent" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-foreground mb-2">{thread.name}</h4>
              <p className="text-sm text-text-secondary mb-3">{thread.description}</p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-text-secondary">
                  <strong>Starts:</strong> Episode {thread.startsInEpisode}
                </span>
                {thread.resolvesInEpisode && (
                  <span className="text-text-secondary">
                    <strong>Resolves:</strong> Episode {thread.resolvesInEpisode}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
