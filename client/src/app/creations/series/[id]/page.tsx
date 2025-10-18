'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { MainContent } from '@/components/layout/MainContent';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  Film,
  Users,
  BookOpen,
  GitBranch,
  Play,
  Calendar,
  CheckCircle2,
  Circle,
  Eye,
} from 'lucide-react';
import {
  fetchSeriesWithEpisodes,
  SeriesWithId,
  EpisodeWithId,
} from '@/lib/api';
import { useSeriesStore } from '@/stores/useSeriesStore';

export default function SeriesDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { getToken, isSignedIn } = useAuth();
  const { setCurrentSeries } = useSeriesStore();

  const [series, setSeries] = useState<SeriesWithId | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'characters' | 'episodes' | 'plot'>('overview');

  const seriesId = params.id as string;

  useEffect(() => {
    const loadSeriesDetails = async () => {
      if (!isSignedIn || !seriesId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = await getToken();
        if (token) {
          const data = await fetchSeriesWithEpisodes(seriesId, token);
          setSeries(data.series);
          setEpisodes(data.episodes);
        }
      } catch (err) {
        console.error('Failed to load series:', err);
        setError('Failed to load series details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadSeriesDetails();
  }, [isSignedIn, seriesId, getToken]);

  const handleContinueWriting = () => {
    if (!series) return;

    setCurrentSeries(
      {
        seriesTitle: series.seriesTitle,
        seriesDescription: series.seriesDescription,
        tagline: series.tagline,
        themes: series.themes,
        masterCharacters: series.masterCharacters,
        episodeOutlines: series.episodeOutlines,
        plotThreads: series.plotThreads,
        totalEpisodes: series.totalEpisodes,
      },
      series.id
    );
    router.push('/episode-writer');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <MainContent title="Series Details" description="View your series information">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading series details...</p>
        </div>
      </MainContent>
    );
  }

  if (error || !series) {
    return (
      <MainContent title="Series Details" description="View your series information">
        <Card className="text-center py-12">
          <p className="text-red-400 mb-4">{error || 'Series not found'}</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </Button>
            <Button
              onClick={() => router.push('/creations/series')}
              className="flex items-center justify-center gap-2"
            >
              <span>View All Series</span>
            </Button>
          </div>
        </Card>
      </MainContent>
    );
  }

  const writtenEpisodesCount = episodes.length;
  const progressPercentage = (writtenEpisodesCount / series.totalEpisodes) * 100;

  return (
    <MainContent
      title={series.seriesTitle}
      description={series.tagline || 'Series Details'}
    >
      {/* Back Button */}
      <button
        onClick={() => router.push('/creations/series')}
        className="flex items-center gap-2 text-text-secondary hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Series
      </button>

      {/* Series Header Card */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Film className="w-8 h-8 text-primary-accent" />
                <h1 className="text-2xl font-bold text-foreground">{series.seriesTitle}</h1>
              </div>
              {series.tagline && (
                <p className="text-lg text-primary-accent/80 italic mb-3">
                  &quot;{series.tagline}&quot;
                </p>
              )}
            </div>
            <Button
              onClick={handleContinueWriting}
              className="flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>Continue Writing</span>
            </Button>
          </div>

          <p className="text-text-secondary mb-4">{series.seriesDescription}</p>

          {/* Themes */}
          {series.themes && series.themes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {series.themes.map((theme, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-primary-accent/20 text-primary-accent rounded-full"
                >
                  {theme}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-hover p-4 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{series.totalEpisodes}</div>
              <div className="text-sm text-text-secondary">Total Episodes</div>
            </div>
            <div className="bg-hover p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary-accent">{writtenEpisodesCount}</div>
              <div className="text-sm text-text-secondary">Written</div>
            </div>
            <div className="bg-hover p-4 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {series.masterCharacters?.length || 0}
              </div>
              <div className="text-sm text-text-secondary">Characters</div>
            </div>
            <div className="bg-hover p-4 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {series.plotThreads?.length || 0}
              </div>
              <div className="text-sm text-text-secondary">Plot Threads</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-text-secondary">Overall Progress</span>
              <span className="text-sm font-semibold text-foreground">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full h-3 bg-input rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-accent to-purple-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-4 pt-4 border-t border-border flex items-center gap-4 text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Created {formatDate(series.created_at)}
            </span>
            <span>•</span>
            <span>Last updated {formatDate(series.updated_at)}</span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        {[
          { id: 'overview', label: 'Overview', icon: Eye },
          { id: 'characters', label: 'Characters', icon: Users },
          { id: 'episodes', label: 'Episodes', icon: BookOpen },
          { id: 'plot', label: 'Plot Threads', icon: GitBranch },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-accent text-primary-accent'
                  : 'border-transparent text-text-secondary hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader
                title="Episode Outlines"
                description={`${series.episodeOutlines?.length || 0} episodes planned`}
              />
              <div className="space-y-3">
                {series.episodeOutlines?.map((outline) => {
                  const isWritten = episodes.some(
                    (ep) => ep.episode_number === outline.episodeNumber
                  );
                  return (
                    <div
                      key={outline.episodeNumber}
                      className="p-3 bg-hover rounded-lg border border-border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-foreground">
                          Episode {outline.episodeNumber}: {outline.title}
                        </span>
                        {isWritten ? (
                          <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-1" />
                        ) : (
                          <Circle className="w-4 h-4 text-text-secondary flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-text-secondary">{outline.synopsis}</p>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Quick Stats"
                description="Series information at a glance"
              />
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Characters</h4>
                  <div className="flex flex-wrap gap-2">
                    {series.masterCharacters?.slice(0, 5).map((char, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-input text-foreground rounded-full"
                      >
                        {char.name}
                      </span>
                    ))}
                    {(series.masterCharacters?.length || 0) > 5 && (
                      <span className="px-2 py-1 text-xs bg-primary-accent/20 text-primary-accent rounded-full">
                        +{(series.masterCharacters?.length || 0) - 5} more
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Plot Threads</h4>
                  <div className="space-y-2">
                    {series.plotThreads?.map((thread, index) => (
                      <div key={index} className="text-sm">
                        <span className="text-foreground font-medium">{thread.name}</span>
                        <span className="text-text-secondary text-xs ml-2">
                          (Ep. {thread.startsInEpisode}
                          {thread.resolvesInEpisode && ` - ${thread.resolvesInEpisode}`})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Characters Tab */}
        {activeTab === 'characters' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {series.masterCharacters?.map((character, index) => (
              <Card key={index}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{character.name}</h3>
                    <span className="px-2 py-1 text-xs bg-primary-accent/20 text-primary-accent rounded-full">
                      {character.role}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">{character.description}</p>
                  <div className="pt-3 border-t border-border">
                    <h4 className="text-xs font-semibold text-foreground mb-1">Key Traits</h4>
                    <p className="text-xs text-text-secondary">{character.keyTraits}</p>
                  </div>
                  {character.visualAnchorPrompt && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <h4 className="text-xs font-semibold text-foreground mb-1">
                        Visual Description
                      </h4>
                      <p className="text-xs text-text-secondary italic">
                        {character.visualAnchorPrompt}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Episodes Tab */}
        {activeTab === 'episodes' && (
          <div className="space-y-4">
            {series.episodeOutlines?.map((outline) => {
              const writtenEpisode = episodes.find(
                (ep) => ep.episode_number === outline.episodeNumber
              );
              const isWritten = !!writtenEpisode;

              return (
                <Card key={outline.episodeNumber}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-bold text-foreground">
                            Episode {outline.episodeNumber}
                          </span>
                          {isWritten ? (
                            <span className="flex items-center gap-1 text-xs text-success">
                              <CheckCircle2 className="w-3 h-3" />
                              Written
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-text-secondary">
                              <Circle className="w-3 h-3" />
                              Not written
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {isWritten ? writtenEpisode.episodeTitle : outline.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-text-secondary mb-4">{outline.synopsis}</p>

                    {outline.keyEvents && outline.keyEvents.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-foreground mb-2">Key Events</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {outline.keyEvents.map((event, index) => (
                            <li key={index} className="text-sm text-text-secondary">
                              {event}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {outline.charactersInvolved && outline.charactersInvolved.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-foreground mb-2">
                          Characters Involved
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {outline.charactersInvolved.map((char, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-input text-foreground rounded-full"
                            >
                              {char}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {isWritten && writtenEpisode.scenesWithPrompts && (
                      <div className="pt-4 border-t border-border">
                        <p className="text-sm text-text-secondary">
                          {writtenEpisode.scenesWithPrompts.length} scenes written
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Plot Threads Tab */}
        {activeTab === 'plot' && (
          <div className="space-y-4">
            {series.plotThreads?.map((thread, index) => (
              <Card key={index}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{thread.name}</h3>
                    <span className="px-2 py-1 text-xs bg-input text-foreground rounded-full">
                      Ep. {thread.startsInEpisode}
                      {thread.resolvesInEpisode && ` - ${thread.resolvesInEpisode}`}
                    </span>
                  </div>
                  <p className="text-text-secondary">{thread.description}</p>

                  {/* Visual timeline */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-input rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-accent"
                          style={{
                            marginLeft: `${((thread.startsInEpisode - 1) / series.totalEpisodes) * 100}%`,
                            width: `${
                              ((thread.resolvesInEpisode || series.totalEpisodes) -
                                thread.startsInEpisode +
                                1) /
                              series.totalEpisodes *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-text-secondary">
                      <span>Episode 1</span>
                      <span>Episode {series.totalEpisodes}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainContent>
  );
}
