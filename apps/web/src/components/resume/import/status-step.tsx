/**
 * StatusStep — displays import progress or result.
 */

'use client';

import { type ImportJobDto, useResumeImportGetStatus } from '@profile/api-client';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui';

interface StatusStepProps {
  importId: string;
  onSuccess?: (resumeId: string) => void;
  onClose: () => void;
}

export function StatusStep({ importId, onSuccess, onClose }: StatusStepProps) {
  const statusQuery = useResumeImportGetStatus(importId, {
    query: { refetchInterval: 1000 },
  });
  const job = statusQuery.data?.data?.data as ImportJobDto | undefined;

  if (job?.status === 'COMPLETED' && job.resumeId) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 pt-0 text-center">
        <div className="rounded-full bg-emerald-500/20 p-4">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <div>
          <p className="text-base font-medium text-white">Import Complete</p>
          <p className="mt-1 text-sm text-zinc-400">Your resume has been imported successfully.</p>
        </div>
        <Button
          onClick={() => {
            onSuccess?.(job.resumeId!);
            onClose();
          }}
          className="gap-2"
        >
          View Resume
        </Button>
      </div>
    );
  }

  if (job?.status === 'FAILED') {
    return (
      <div className="flex flex-col items-center gap-4 p-6 pt-0 text-center">
        <div className="rounded-full bg-red-500/20 p-4">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <div>
          <p className="text-base font-medium text-white">Import Failed</p>
          {job.error && <p className="mt-1 text-sm text-red-400">{job.error}</p>}
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 pt-0 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
      <div>
        <p className="text-base font-medium text-white">
          {job?.status === 'PROCESSING' ? 'Processing…' : 'Waiting to start…'}
        </p>
        <p className="mt-1 text-sm text-zinc-400">This usually takes a few seconds.</p>
      </div>
    </div>
  );
}
