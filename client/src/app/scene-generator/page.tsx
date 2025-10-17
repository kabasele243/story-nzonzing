'use client';

import { useState } from 'react';
import { MainContent } from '@/components/layout/MainContent';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { generateScenes, Character, SceneWithPrompt } from '@/lib/api';
import { Copy, Image, User } from 'lucide-react';

export default function SceneGeneratorPage() {
  const [fullStory, setFullStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [scenes, setScenes] = useState<SceneWithPrompt[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullStory.trim()) {
      setError('Please enter a full story');
      return;
    }

    setLoading(true);
    setError('');
    setCharacters([]);
    setScenes([]);

    try {
      const result = await generateScenes({ fullStory });

      // Extract characters from scenes (if available in your API response)
      // For now, we'll show just the scenes
      setScenes(result.scenesWithPrompts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <MainContent
      title="Scene Generator"
      description="Analyze a full story to extract characters, scenes, and image prompts"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader
              title="Full Story"
              description="Paste a complete story to analyze"
            />
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                value={fullStory}
                onChange={(e) => setFullStory(e.target.value)}
                placeholder="Paste your full story here..."
                rows={16}
                error={error}
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">
                  {fullStory.split(' ').filter(Boolean).length} words
                </span>
                <Button type="submit" loading={loading}>
                  <Image className="w-4 h-4 mr-2" />
                  {loading ? 'Analyzing...' : 'Generate Scenes'}
                </Button>
              </div>
            </form>
          </Card>

          {loading && (
            <Card className="mt-6">
              <CardHeader title="Processing" />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary-accent border-t-transparent rounded-full animate-spin" />
                  <span className="text-foreground">Analyzing story structure...</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          {scenes.length > 0 && (
            <div className="space-y-6">
              {scenes.map((scene) => (
                <Card key={scene.sceneNumber}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-foreground text-lg">Scene {scene.sceneNumber}</h4>
                      <p className="text-sm text-text-secondary mt-1">{scene.setting}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <User className="w-4 h-4" />
                      <span>{scene.charactersPresent.length}</span>
                    </div>
                  </div>

                  <div className="mb-4 pb-4 border-b border-border">
                    <p className="text-sm text-foreground mb-2">{scene.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {scene.charactersPresent.map((char, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary-accent/20 text-primary-accent text-xs rounded"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-sm font-semibold text-primary-accent flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        Image Generation Prompt
                      </h5>
                      <Button variant="secondary" onClick={() => copyToClipboard(scene.imagePrompt)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="bg-hover p-4 rounded-md">
                      <p className="text-xs text-foreground leading-relaxed">{scene.imagePrompt}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!scenes.length && !loading && (
            <Card className="text-center py-12">
              <Image className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary">
                Enter a full story to generate scenes and image prompts
              </p>
            </Card>
          )}
        </div>
      </div>
    </MainContent>
  );
}
