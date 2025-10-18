'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { MainContent } from '@/components/layout/MainContent';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { runCompletePipeline, CompletePipelineOutput, Character, SceneWithPrompt } from '@/lib/api';
import { CheckCircle2, Circle, Copy, User } from 'lucide-react';

const EXAMPLE_SUMMARIES = [
  "A lonely astronaut discovers a mysterious signal from a distant planet. When they arrive, they find an abandoned alien civilization with one last survivor who knows the truth about humanity's origins.",
  "In a world where memories can be traded like currency, a memory thief finds themselves stealing their own forgotten past, uncovering a conspiracy that threatens to erase entire populations.",
];

export default function CompletePipelinePage() {
  const { getToken, isSignedIn } = useAuth();
  const [summary, setSummary] = useState('');
  const [duration, setDuration] = useState<'5' | '10' | '30'>('10');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CompletePipelineOutput | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Expanding Story', completed: currentStep > 0 },
    { label: 'Extracting Characters', completed: currentStep > 1 },
    { label: 'Segmenting Scenes', completed: currentStep > 2 },
    { label: 'Generating Prompts', completed: currentStep > 3 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
      setError('Please sign in to create a story');
      return;
    }

    if (!summary.trim()) {
      setError('Please enter a story summary');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setCurrentStep(0);

    try {
      // Get authentication token from Clerk
      const token = await getToken();

      if (!token) {
        throw new Error('Failed to get authentication token. Please sign in again.');
      }

      // Simulate step progression
      const progressInterval = setInterval(() => {
        setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 3000);

      // Call API with authentication token
      const output = await runCompletePipeline({ storySummary: summary, duration }, token);
      clearInterval(progressInterval);
      setCurrentStep(4);
      setResult(output);
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

  return (
    <MainContent
      title="Complete Pipeline"
      description="Transform a short summary into a full story with characters, scenes, and image prompts"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader
              title="Story Summary"
              description="Enter a story summary"
            />
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Story Duration</label>
                <div className="flex gap-2">
                  {(['5', '10', '30'] as const).map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setDuration(dur)}
                      className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                        duration === dur
                          ? 'border-primary-accent bg-primary-accent/20 text-primary-accent'
                          : 'border-border bg-hover text-text-secondary hover:border-primary-accent/50'
                      }`}
                    >
                      <div className="font-semibold text-sm">{dur} min</div>
                      <div className="text-xs">~{getDurationWords(dur)} words</div>
                    </button>
                  ))}
                </div>
              </div>

              <Input
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="A lonely astronaut discovers..."
                rows={6}
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
                    {example.substring(0, 80)}...
                  </button>
                ))}
              </div>

              <Button type="submit" loading={loading} className="w-full">
                {loading ? 'Processing...' : 'Generate Story Pipeline'}
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
          {result && (
            <Tabs
              tabs={[
                {
                  id: 'story',
                  label: 'Full Story',
                  content: <StoryView story={result.fullStory} onCopy={copyToClipboard} />,
                },
                {
                  id: 'characters',
                  label: 'Characters',
                  content: <CharactersView characters={result.characters} />,
                },
                {
                  id: 'scenes',
                  label: 'Scenes & Prompts',
                  content: <ScenesView scenes={result.scenesWithPrompts} onCopy={copyToClipboard} />,
                },
              ]}
            />
          )}

          {!result && !loading && (
            <Card className="text-center py-12">
              <p className="text-text-secondary">
                Enter a story summary to get started
              </p>
            </Card>
          )}
        </div>
      </div>
    </MainContent>
  );
}

function StoryView({ story, onCopy }: { story: string; onCopy: (text: string) => void }) {
  const wordCount = story ? story.split(' ').filter(Boolean).length : 0;

  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <CardHeader title="Expanded Story" description={`${wordCount} words`} />
        <Button variant="secondary" onClick={() => onCopy(story)} disabled={!story}>
          <Copy className="w-4 h-4" />
        </Button>
      </div>
      <div className="prose prose-invert max-w-none">
        {story ? (
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">{story}</p>
        ) : (
          <p className="text-text-secondary">No story available</p>
        )}
      </div>
    </Card>
  );
}

function CharactersView({ characters }: { characters: Character[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {characters.map((character, idx) => (
        <Card key={idx}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary-accent" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-foreground">{character.name}</h4>
              <p className="text-sm text-text-secondary mt-1">{character.description}</p>
              <p className="text-sm text-foreground mt-2">{character.keyTraits}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ScenesView({ scenes, onCopy }: { scenes: SceneWithPrompt[]; onCopy: (text: string) => void }) {
  return (
    <div className="space-y-6">
      {scenes.map((scene) => (
        <Card key={scene.sceneNumber}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-bold text-foreground">Scene {scene.sceneNumber}</h4>
              <p className="text-sm text-text-secondary">{scene.setting}</p>
            </div>
            <div className="text-xs text-text-secondary">
              {scene.charactersPresent.join(', ')}
            </div>
          </div>

          <p className="text-sm text-foreground mb-4">{scene.description}</p>

          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center mb-2">
              <h5 className="text-sm font-semibold text-primary-accent">Image Prompt</h5>
              <Button variant="secondary" onClick={() => onCopy(scene.imagePrompt)}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">{scene.imagePrompt}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
