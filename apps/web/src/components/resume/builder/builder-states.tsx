/**
 * ResumeBuilder state components — loading and empty states.
 */

'use client';

import { useI18n } from '@profile/i18n';
import { FileText, Settings } from 'lucide-react';
import Link from 'next/link';
import { LoadingState } from '@/shared/components/ui';

export function BuilderLoadingState() {
  const { t } = useI18n();
  return (
    <div className="min-h-[80vh] bg-pf-hover-subtle">
      <LoadingState message={t('resume.builder.loading')} minHeight="80vh" />
    </div>
  );
}

export function BuilderEmptyState() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-pf-hover-subtle px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pf-hover-subtle">
        <FileText className="h-8 w-8 text-pf-fg-subtle" strokeWidth={1.5} />
      </div>
      <h2 className="mt-6 text-lg font-semibold text-pf-fg-default">
        {t('resume.builder.noResume.title')}
      </h2>
      <p className="mt-2 max-w-sm text-center text-sm text-pf-fg-muted">
        {t('resume.builder.noResume.description')}
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Link
          href="/protected/onboarding"
          className="inline-flex h-10 items-center rounded-lg bg-pf-canvas-emphasis px-5 text-sm font-medium text-pf-fg-on-emphasis transition-opacity hover:opacity-90"
        >
          {t('resume.builder.noResume.getStarted')}
        </Link>
        <Link
          href="/protected/settings"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-pf-border-default bg-pf-canvas-subtle/80 px-4 text-sm font-medium text-pf-fg-muted transition-colors hover:bg-pf-hover-subtle hover:text-pf-fg-default"
        >
          <Settings className="h-4 w-4" strokeWidth={1.5} />
          {t('app.settings.title')}
        </Link>
      </div>
    </div>
  );
}
