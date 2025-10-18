'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { MainContent } from '@/components/layout/MainContent';
import { Card, CardHeader } from '@/components/ui/Card';
import { Loader2, Zap, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface WorkflowRun {
  id: string;
  workflow_type: string;
  status: 'running' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  metadata?: Record<string, unknown>;
}

export default function RecentWorkflowsPage() {
  const { getToken, isSignedIn } = useAuth();
  const [workflows, setWorkflows] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflows = async () => {
      if (!isSignedIn) return;

      try {
        setLoading(true);
        const token = await getToken();

        if (token) {
          // TODO: Fetch actual workflows from API
          // For now, using placeholder empty array
          setWorkflows([]);
        }
      } catch (error) {
        console.error('Failed to fetch workflows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, [isSignedIn, getToken]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'running':
        return `${baseClasses} bg-blue-500/20 text-blue-500`;
      case 'completed':
        return `${baseClasses} bg-green-500/20 text-green-500`;
      case 'failed':
        return `${baseClasses} bg-red-500/20 text-red-500`;
      default:
        return `${baseClasses} bg-yellow-500/20 text-yellow-500`;
    }
  };

  const formatWorkflowType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <MainContent
      title="Recent Workflows"
      description="Track your active and recent AI generation workflows"
    >
      <div className="space-y-6">
        {/* Active Workflows */}
        <Card>
          <CardHeader
            title="Active Workflows"
            description="Currently running AI generation tasks"
          />
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-accent" />
            </div>
          ) : workflows.filter(w => w.status === 'running').length === 0 ? (
            <div className="text-center p-12">
              <Zap className="w-12 h-12 text-text-secondary mx-auto mb-3 opacity-50" />
              <p className="text-text-secondary">No active workflows</p>
            </div>
          ) : (
            <div className="space-y-3">
              {workflows
                .filter(w => w.status === 'running')
                .map((workflow) => (
                  <div
                    key={workflow.id}
                    className="flex items-center gap-4 p-4 bg-hover rounded-lg border border-border"
                  >
                    {getStatusIcon(workflow.status)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {formatWorkflowType(workflow.workflow_type)}
                      </h3>
                      <p className="text-xs text-text-secondary">
                        Started {formatDistanceToNow(new Date(workflow.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <span className={getStatusBadge(workflow.status)}>
                      {workflow.status}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </Card>

        {/* Recent Completed */}
        <Card>
          <CardHeader
            title="Recently Completed"
            description="Your latest finished workflows"
          />
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-accent" />
            </div>
          ) : workflows.filter(w => w.status !== 'running').length === 0 ? (
            <div className="text-center p-12">
              <Clock className="w-12 h-12 text-text-secondary mx-auto mb-3 opacity-50" />
              <p className="text-text-secondary">No workflow history yet</p>
              <p className="text-xs text-text-secondary mt-2">
                Start creating to see your workflow history here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {workflows
                .filter(w => w.status !== 'running')
                .slice(0, 10)
                .map((workflow) => (
                  <div
                    key={workflow.id}
                    className="flex items-center gap-4 p-4 bg-hover rounded-lg border border-border"
                  >
                    {getStatusIcon(workflow.status)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {formatWorkflowType(workflow.workflow_type)}
                      </h3>
                      <p className="text-xs text-text-secondary">
                        Completed {formatDistanceToNow(new Date(workflow.completed_at || workflow.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <span className={getStatusBadge(workflow.status)}>
                      {workflow.status}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </Card>
      </div>
    </MainContent>
  );
}
