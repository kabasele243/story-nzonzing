'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { MainContent } from '@/components/layout/MainContent';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Film,
  Plus,
  Play,
  Eye,
  Trash2,
  Calendar,
  CheckCircle2,
  Circle,
  Search,
  Sparkles,
} from 'lucide-react';
import { fetchUserSeries, SeriesWithId } from '@/lib/api';
import { useSeriesStore } from '@/stores/useSeriesStore';

export default function SeriesPage() {
  const router = useRouter();
  const { getToken, isSignedIn } = useAuth();
  const { seriesList, setSeriesList, setCurrentSeries } = useSeriesStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadSeries = async () => {
      if (!isSignedIn) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = await getToken();
        if (token) {
          const series = await fetchUserSeries(token);
          setSeriesList(series);
        }
      } catch (err) {
        console.error('Failed to load series:', err);
        setError('Failed to load your series. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, [isSignedIn, getToken, setSeriesList]);

  const handleSelectSeries = (series: SeriesWithId) => {
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

  const handleViewSeries = (seriesId: string) => {
    router.push(`/creations/series/${seriesId}`);
  };

  const handleDeleteSeries = async (seriesId: string) => {
    // TODO: Implement delete functionality
    console.log('Delete series:', seriesId);
  };

  const filteredSeries = seriesList.filter((series) =>
    series.seriesTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate progress for each series (mock data for now - you'll need to fetch episode counts)
  const getSeriesProgress = (series: SeriesWithId) => {
    // TODO: Fetch actual episode count from database
    return {
      completed: 0, // Episodes written
      total: series.totalEpisodes,
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!isSignedIn) {
    return (
      <MainContent
        title="My Series"
        description="Manage your story series and episodes"
      >
        <Card className="text-center py-12">
          <Film className="w-16 h-16 mx-auto mb-4 text-text-secondary" />
          <h3 className="text-xl font-semibold mb-2">Sign in to view your series</h3>
          <p className="text-text-secondary mb-6">
            Create an account or sign in to start creating episodic stories
          </p>
          <Button onClick={() => router.push('/sign-in')}>Sign In</Button>
        </Card>
      </MainContent>
    );
  }

  return (
    <MainContent
      title="My Series"
      description="Manage your story series and episodes"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search series..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-text-secondary focus:border-primary-accent focus:outline-none"
          />
        </div>

        {/* Create New Series Button */}
        <Button
          onClick={() => router.push('/series-creator')}
          className="flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Series</span>
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading your series...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && filteredSeries.length === 0 && seriesList.length === 0 && (
        <Card className="text-center py-12">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary-accent" />
          <h3 className="text-xl font-semibold mb-2">No series yet</h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Create your first episodic story series. Build compelling narratives with
            recurring characters and ongoing plot threads.
          </p>
          <Button
            onClick={() => router.push('/series-creator')}
            className="flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Series</span>
          </Button>
        </Card>
      )}

      {/* No Search Results */}
      {!loading && !error && filteredSeries.length === 0 && seriesList.length > 0 && (
        <Card className="text-center py-12">
          <Search className="w-16 h-16 mx-auto mb-4 text-text-secondary" />
          <h3 className="text-xl font-semibold mb-2">No series found</h3>
          <p className="text-text-secondary mb-6">
            No series match &quot;{searchQuery}&quot;. Try a different search term.
          </p>
          <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
        </Card>
      )}

      {/* Series Grid */}
      {!loading && !error && filteredSeries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSeries.map((series) => {
            const progress = getSeriesProgress(series);
            const progressPercentage = (progress.completed / progress.total) * 100;

            return (
              <Card key={series.id} className="group hover:border-primary-accent transition-all">
                {/* Series Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Film className="w-8 h-8 text-primary-accent flex-shrink-0" />
                    <span className="text-xs text-text-secondary flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(series.created_at)}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary-accent transition-colors">
                    {series.seriesTitle}
                  </h3>

                  {series.tagline && (
                    <p className="text-sm text-primary-accent/80 italic mb-3 line-clamp-1">
                      &quot;{series.tagline}&quot;
                    </p>
                  )}

                  <p className="text-sm text-text-secondary line-clamp-3 mb-4">
                    {series.seriesDescription}
                  </p>

                  {/* Themes */}
                  {series.themes && series.themes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {series.themes.slice(0, 3).map((theme, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-primary-accent/20 text-primary-accent rounded-full"
                        >
                          {theme}
                        </span>
                      ))}
                      {series.themes.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-input text-text-secondary rounded-full">
                          +{series.themes.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-text-secondary">Episodes</span>
                      <span className="text-xs font-semibold text-foreground">
                        {progress.completed}/{progress.total}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-input rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-accent to-purple-500 transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Character Count */}
                  {series.masterCharacters && series.masterCharacters.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-text-secondary mb-4">
                      <span className="flex items-center gap-1">
                        {series.masterCharacters.length} Character
                        {series.masterCharacters.length !== 1 ? 's' : ''}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {series.plotThreads?.length || 0} Plot Thread
                        {series.plotThreads?.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSelectSeries(series)}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Continue</span>
                    </Button>
                    <Button
                      onClick={() => handleViewSeries(series.id)}
                      variant="secondary"
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </Button>
                  </div>

                  {/* Delete Button (hidden until hover) */}
                  <button
                    onClick={() => handleDeleteSeries(series.id)}
                    className="mt-3 w-full py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete Series</span>
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Series Count */}
      {!loading && !error && seriesList.length > 0 && (
        <div className="mt-6 text-center text-sm text-text-secondary">
          Showing {filteredSeries.length} of {seriesList.length} series
        </div>
      )}
    </MainContent>
  );
}
