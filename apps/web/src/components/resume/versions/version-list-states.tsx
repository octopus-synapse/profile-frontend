/**
 * VersionListStates — loading, empty, and error states for version list.
 */

'use client';

import { Skeleton } from '@octopus-synapse/profile-ui';
import { useI18n } from '@profile/i18n';
import { History } from 'lucide-react';

export function VersionSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton className="h-6 w-10 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function VersionEmptyState() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <History className="h-10 w-10 text-zinc-600" />
      <p className="text-sm text-zinc-400">{t('resume.versions.noVersions')}</p>
    </div>
  );
}

export function VersionErrorState() {
  const { t } = useI18n();
  return <p className="p-5 text-sm text-red-400">{t('resume.versions.failedLoad')}</p>;
}
