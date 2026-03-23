'use client';

import {
  ArrowDownRight,
  ArrowUpRight,
  Camera,
  LayoutDashboard,
  Minus,
} from 'lucide-react';
import { useCallback } from 'react';

import { Badge, Button, Skeleton } from '@/shared/components/ui';
import { showToast } from '@/shared/components/ui/toast';

import { AtsScoreWidget } from './ats-score-widget';
import {
  useCreateSnapshot,
  useProgression,
} from './hooks/use-resume-analytics';
import { JobMatchTool } from './job-match-tool';
import { KeywordAnalysisPanel } from './keyword-analysis-panel';
import { ViewStatsChart } from './view-stats-chart';

interface AnalyticsDashboardProps {
  resumeId: string;
}

const TREND_CONFIG = {
  improving: {
    icon: ArrowUpRight,
    label: 'Improving',
    variant: 'success' as const,
    color: 'text-emerald-400',
  },
  stable: {
    icon: Minus,
    label: 'Stable',
    variant: 'info' as const,
    color: 'text-cyan-400',
  },
  declining: {
    icon: ArrowDownRight,
    label: 'Declining',
    variant: 'warning' as const,
    color: 'text-amber-400',
  },
} as const;

function TrendIndicator({
  trend,
  changePercent,
}: {
  trend: 'improving' | 'stable' | 'declining';
  changePercent: number;
}) {
  const config = TREND_CONFIG[trend];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${config.color}`} />
      <Badge variant={config.variant} size="sm">
        {config.label}
      </Badge>
      {changePercent !== 0 && (
        <span className={`text-sm font-medium ${config.color}`}>
          {changePercent > 0 ? '+' : ''}
          {changePercent.toFixed(1)}%
        </span>
      )}
    </div>
  );
}

function ProgressionSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-5 w-5 rounded-full" />
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-5 w-12" />
    </div>
  );
}

export function AnalyticsDashboard({ resumeId }: AnalyticsDashboardProps) {
  const { data: progression, isLoading: progressionLoading } = useProgression(resumeId);
  const { mutateAsync: createSnapshot, isPending: snapshotPending } =
    useCreateSnapshot(resumeId);

  const handleSnapshot = useCallback(async () => {
    try {
      await createSnapshot();
      showToast.success('Snapshot created', 'Progress has been recorded.');
    } catch {
      showToast.error('Snapshot failed', 'Could not create snapshot.');
    }
  }, [createSnapshot]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-6 w-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Resume Analytics</h2>
        </div>

        <div className="flex items-center gap-4">
          {progressionLoading ? (
            <ProgressionSkeleton />
          ) : (
            progression && (
              <TrendIndicator
                trend={progression.trend}
                changePercent={progression.changePercent}
              />
            )
          )}

          <Button
            size="sm"
            variant="ghost"
            loading={snapshotPending}
            onClick={handleSnapshot}
            leftIcon={
              snapshotPending ? undefined : <Camera className="h-4 w-4" />
            }
          >
            {snapshotPending ? 'Saving…' : 'Take Snapshot'}
          </Button>
        </div>
      </div>

      {/* Top row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ViewStatsChart resumeId={resumeId} />
        <AtsScoreWidget resumeId={resumeId} />
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <KeywordAnalysisPanel resumeId={resumeId} />
        <JobMatchTool resumeId={resumeId} />
      </div>
    </div>
  );
}
