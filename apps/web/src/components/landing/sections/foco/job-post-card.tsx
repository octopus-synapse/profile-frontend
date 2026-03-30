'use client';

import type { DictionaryKey } from '@profile/i18n';
import { Building2, MapPin } from 'lucide-react';
import { FOCO_JOBS } from '../../data';

interface JobPostCardProps {
  currentJob: number;
  t: (key: DictionaryKey, params?: Record<string, string | number>) => string;
}

export function JobPostCard({ currentJob, t }: JobPostCardProps) {
  const job = FOCO_JOBS[currentJob]!;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
          <Building2 className="h-6 w-6 text-white" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-zinc-900 transition-all duration-300">{t(job.key)}</p>
          <p className="text-sm text-zinc-500">{job.company}</p>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4 text-sm text-zinc-500">
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4" strokeWidth={1.5} />
          {job.location}
        </span>
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          {t('landing.foco.jobActive')}
        </span>
      </div>

      <div className="space-y-2">
        <div className="h-2 w-full rounded bg-zinc-100" />
        <div className="h-2 w-4/5 rounded bg-zinc-100" />
        <div className="h-2 w-3/5 rounded bg-zinc-100" />
      </div>
    </div>
  );
}
