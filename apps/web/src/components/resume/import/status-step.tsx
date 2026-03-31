/**
 * StatusStep — displays import progress or result.
 */

'use client';

import { Button } from '@octopus-synapse/profile-ui';
import { type ImportJobDto, useResumeImportGetStatus } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface StatusStepProps {
  importId: string;
  onSuccess?: (resumeId: string) => void;
  onClose: () => void;
}

export function StatusStep({ importId, onSuccess, onClose }: StatusStepProps) {
  const { t } = useI18n();
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
          <p className="text-base font-medium text-white">{t('resume.import.wizard.complete')}</p>
          <p className="mt-1 text-sm text-zinc-400">{t('resume.import.wizard.completeDesc')}</p>
        </div>
        <Button
          onClick={() => {
            onSuccess?.(job.resumeId!);
            onClose();
          }}
          className="gap-2"
        >
          {t('resume.import.wizard.viewResume')}
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
          <p className="text-base font-medium text-white">{t('resume.import.wizard.failed')}</p>
          {job.errors?.length && <p className="mt-1 text-sm text-red-400">{job.errors[0]}</p>}
        </div>
        <Button variant="outline" onClick={onClose}>
          {t('action.close')}
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
        <p className="mt-1 text-sm text-zinc-400">{t('resume.import.wizard.processing')}</p>
      </div>
    </div>
  );
}
