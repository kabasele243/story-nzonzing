'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { MainContent } from '@/components/layout/MainContent';
import { Card, CardHeader } from '@/components/ui/Card';
import { Loader2, History, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface HistoryEntry {
  id: string;
  workflow_type: string;
  status: 'completed' | 'failed';
  created_at: string;
  completed_at: string;
  duration_ms?: number;
  metadata?: Record<string, unknown>;
}

export default function HistoryPage() {
  const { getToken, isSignedIn } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed'>('all');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!isSignedIn) return;

      try {
        setLoading(true);
        const token = await getToken();

        if (token) {
          // TODO: Fetch actual history from API
          // For now, using placeholder empty array
          setHistory([]);
        }
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isSignedIn, getToken]);

  const filteredHistory = history.filter(entry => {
    if (filter === 'all') return true;
    return entry.status === filter;
  });

  const getStatusIcon = (status: string) => {
    return status === 'completed' ? (
      <CheckCircle2 className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const formatWorkflowType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const stats = {
    total: history.length,
    completed: history.filter(h => h.status === 'completed').length,
    failed: history.filter(h => h.status === 'failed').length,
  };

  return (
    <MainContent
      title="Workflow History"
      description="Complete history of all your AI generation workflows"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="p-6 text-center">
              <History className="w-12 h-12 text-primary-accent mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">{stats.total}</div>
              <div className="text-sm text-text-secondary">Total Workflows</div>
            </div>
          </Card>

          <Card>
            <div className="p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">{stats.completed}</div>
              <div className="text-sm text-text-secondary">Completed</div>
            </div>
          </Card>

          <Card>
            <div className="p-6 text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">{stats.failed}</div>
              <div className="text-sm text-text-secondary">Failed</div>
            </div>
          </Card>
        </div>

        {/* Filter and History */}
        <Card>
          <CardHeader
            title="Workflow History"
            description="View all past workflow executions"
          />

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-4 px-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-accent text-white'
                  : 'bg-hover text-text-secondary hover:bg-primary-accent/10'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-hover text-text-secondary hover:bg-green-500/10'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('failed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'failed'
                  ? 'bg-red-500 text-white'
                  : 'bg-hover text-text-secondary hover:bg-red-500/10'
              }`}
            >
              Failed
            </button>
          </div>

          {/* History List */}
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-accent" />
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center p-12">
              <Clock className="w-12 h-12 text-text-secondary mx-auto mb-3 opacity-50" />
              <p className="text-text-secondary">
                {filter === 'all'
                  ? 'No workflow history yet'
                  : `No ${filter} workflows`}
              </p>
              <p className="text-xs text-text-secondary mt-2">
                Start creating to build your workflow history
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-4 p-4 bg-hover hover:bg-primary-accent/5 rounded-lg border border-border transition-colors"
                >
                  {getStatusIcon(entry.status)}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">
                      {formatWorkflowType(entry.workflow_type)}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(entry.created_at), 'MMM d, yyyy h:mm a')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(entry.duration_ms)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-text-secondary">
                      {formatDistanceToNow(new Date(entry.completed_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </MainContent>
  );
}
