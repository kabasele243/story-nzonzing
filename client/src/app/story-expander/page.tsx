'use client';

import { useState } from 'react';
import { MainContent } from '@/components/layout/MainContent';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { expandStory } from '@/lib/api';
import { Copy, Sparkles } from 'lucide-react';

export default function StoryExpanderPage() {
  const [summary, setSummary] = useState('');
  const [duration, setDuration] = useState<'5' | '10' | '30'>('10');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fullStory, setFullStory] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) {
      setError('Please enter a story summary');
      return;
    }

    setLoading(true);
    setError('');
    setFullStory('');

    try {
      const result = await expandStory({ storySummary: summary, duration });
      setFullStory(result.fullStory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullStory);
  };

  const wordCount = fullStory ? fullStory.split(' ').length : 0;

  const getDurationWords = (dur: string) => {
    const minutes = parseInt(dur);
    return minutes * 150;
  };

  return (
    <MainContent
      title="Story Expander"
      description="Transform a story summary into a full narrative"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Story Summary"
            description="Enter a brief story summary"
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
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      duration === dur
                        ? 'border-primary-accent bg-primary-accent/20 text-primary-accent'
                        : 'border-border bg-hover text-text-secondary hover:border-primary-accent/50'
                    }`}
                  >
                    <div className="font-semibold">{dur} min</div>
                    <div className="text-xs">~{getDurationWords(dur)} words</div>
                  </button>
                ))}
              </div>
            </div>

            <Input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Enter your story summary here..."
              rows={10}
              error={error}
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">
                {summary.split(' ').filter(Boolean).length} words
              </span>
              <Button type="submit" loading={loading} className="flex items-center justify-center">
                <Sparkles className="w-4 h-4 mr-2" />
                {loading ? 'Expanding...' : 'Expand Story'}
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <div className="flex justify-between items-start mb-4">
            <CardHeader
              title="Expanded Story"
              description={fullStory ? `${wordCount} words` : 'Your expanded story will appear here'}
            />
            {fullStory && (
              <Button variant="secondary" onClick={copyToClipboard}>
                <Copy className="w-4 h-4" />
              </Button>
            )}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-text-secondary">Expanding your story...</p>
              </div>
            </div>
          )}

          {fullStory && !loading && (
            <div className="prose prose-invert max-w-none">
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">{fullStory}</p>
            </div>
          )}

          {!fullStory && !loading && (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary">
                Enter a story summary to begin
              </p>
            </div>
          )}
        </Card>
      </div>
    </MainContent>
  );
}
