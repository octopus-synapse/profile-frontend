'use client';

/**
 * Import History
 *
 * Displays a list of past resume import jobs with status badges and actions.
 */

import {
  type ImportJobDto,
  useResumeImportCancel,
  useResumeImportGetHistory,
  useResumeImportRetry,
} from '@profile/api-client';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileJson,
  Inbox,
  Loader2,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { Badge, Button, Skeleton } from '@/shared/components/ui';
import { showToast } from '@/shared/components/ui/toast';
import { cn } from '@/shared/utils';

// ============================================================================
// Status Config
// ============================================================================

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: 'success' | 'warning' | 'secondary' | 'outline'; icon: typeof Clock }
> = {
  PENDING: { label: 'Pending', variant: 'secondary', icon: Clock },
  PROCESSING: { label: 'Processing', variant: 'warning', icon: Loader2 },
  COMPLETED: { label: 'Completed', variant: 'success', icon: CheckCircle2 },
  FAILED: { label: 'Failed', variant: 'outline', icon: AlertCircle },
  CANCELLED: { label: 'Cancelled', variant: 'secondary', icon: XCircle },
};

// ============================================================================
// Status Badge
// ============================================================================

const DEFAULT_STATUS = { label: 'Unknown', variant: 'secondary' as const, icon: Clock };

function ImportStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? DEFAULT_STATUS;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1.5">
      <Icon
        className={cn('h-3 w-3', status === 'PROCESSING' && 'animate-spin')}
        strokeWidth={1.5}
      />
      {config.label}
    </Badge>
  );
}

// ============================================================================
// Row Actions
// ============================================================================

function RowActions({ job }: { job: ImportJobDto }) {
  const retryMutation = useResumeImportRetry();
  const cancelMutation = useResumeImportCancel();

  const handleRetry = async () => {
    try {
      await retryMutation.mutateAsync({ importId: job.id, data: {} });
      showToast.success('Import restarted');
    } catch {
      showToast.error('Failed to retry import');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync({ importId: job.id });
      showToast.info('Import cancelled');
    } catch {
      showToast.error('Failed to cancel import');
    }
  };

  return (
    <div className="flex items-center gap-2">
      {job.status === 'FAILED' && (
        <Button
          variant="outline"
          onClick={() => void handleRetry()}
          disabled={retryMutation.isPending}
          className="h-8 gap-1.5 px-3 text-xs"
        >
          {retryMutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Retry
        </Button>
      )}

      {(job.status === 'PENDING' || job.status === 'PROCESSING') && (
        <Button
          variant="outline"
          onClick={() => void handleCancel()}
          disabled={cancelMutation.isPending}
          className="h-8 gap-1.5 px-3 text-xs"
        >
          {cancelMutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <XCircle className="h-3.5 w-3.5" />
          )}
          Cancel
        </Button>
      )}

      {job.status === 'COMPLETED' && job.resumeId && (
        <Button variant="outline" asChild className="h-8 gap-1.5 px-3 text-xs">
          <a href={`/resumes/${job.resumeId}`}>
            <ExternalLink className="h-3.5 w-3.5" />
            View Resume
          </a>
        </Button>
      )}
    </div>
  );
}

// ============================================================================
// Job Row
// ============================================================================

function JobRow({ job }: { job: ImportJobDto }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:bg-white/5">
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5">
          <FileJson className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
        </div>
        <span className="text-sm font-medium text-white">{job.id.slice(0, 8)}…</span>
        <ImportStatusBadge status={job.status} />
      </div>
      <RowActions job={job} />
    </div>
  );
}

// ============================================================================
// Loading Skeleton
// ============================================================================

function ImportHistorySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={`skeleton-${String(i)}`}
          className="flex items-center justify-between rounded-lg border border-white/10 p-4"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Empty State
// ============================================================================

function ImportHistoryEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/10 px-4 py-12 text-center">
      <div className="mb-4 rounded-full bg-white/5 p-4">
        <Inbox className="h-8 w-8 text-zinc-400" strokeWidth={1.5} />
      </div>
      <p className="text-base font-medium text-white">No imports yet</p>
      <p className="mt-1 text-sm text-zinc-400">Import a resume to see your history here.</p>
    </div>
  );
}

// ============================================================================
// Component
// ============================================================================

export function ImportHistory() {
  const historyQuery = useResumeImportGetHistory();
  const jobs = (historyQuery.data?.data?.data as ImportJobDto[] | undefined) ?? [];

  if (historyQuery.isLoading) return <ImportHistorySkeleton />;

  if (!jobs.length) return <ImportHistoryEmpty />;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-white">Import History</h2>
      <div className="space-y-2">
        {jobs.map((job) => (
          <JobRow key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
