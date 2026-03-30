'use client';

import type { DictionaryKey } from '@profile/i18n';
import { FileText } from 'lucide-react';
import { FOCO_JOBS } from '../../data';

interface ResumePreviewCardProps {
  currentJob: number;
  t: (key: DictionaryKey, params?: Record<string, string | number>) => string;
}

export function ResumePreviewCard({ currentJob, t }: ResumePreviewCardProps) {
  const job = FOCO_JOBS[currentJob]!;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-cyan-600" strokeWidth={1.5} />
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-zinc-900">
          {t('landing.foco.generatedResume')}
        </h3>
      </div>

      <div className="space-y-3 rounded-lg border border-zinc-100 bg-zinc-50 p-4">
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 rounded bg-zinc-300" />
          <span className="rounded bg-cyan-100 px-2 py-0.5 font-mono text-[10px] text-cyan-700 transition-all duration-300">
            {t(job.key)}
          </span>
        </div>
        <div className="h-2 w-full rounded bg-zinc-200" />
        <div className="h-2 w-5/6 rounded bg-zinc-200" />
        <div className="h-2 w-4/6 rounded bg-zinc-200" />
        <div className="mt-3 h-px w-full bg-zinc-200" />
        <div className="h-2 w-3/4 rounded bg-zinc-200" />
        <div className="h-2 w-2/3 rounded bg-zinc-200" />
      </div>
    </div>
  );
}
