/**
 * Public Profile Not Found Component
 * Shown when a profile doesn't exist or is not public
 */

'use client';

import { useI18n } from '@profile/i18n';
import { UserX } from 'lucide-react';
import Link from 'next/link';

interface PublicProfileNotFoundProps {
  username: string;
}

export function PublicProfileNotFound({ username }: PublicProfileNotFoundProps) {
  const { t } = useI18n();
  return (
    <div className="bg-pf-canvas-default flex min-h-screen flex-col items-center justify-center px-4">
      <div className="bg-pf-canvas-subtle flex h-20 w-20 items-center justify-center rounded-2xl">
        <UserX className="text-pf-fg-muted h-10 w-10" strokeWidth={1.5} />
      </div>

      <h1 className="text-pf-fg-default mt-8 text-2xl font-bold">
        {t('social.profile.notFound' as Parameters<typeof t>[0])}
      </h1>

      <p className="text-pf-fg-muted mt-3 max-w-md text-center">
        {t('social.profile.theProfile' as Parameters<typeof t>[0])}{' '}
        <span className="text-pf-fg-default font-medium">@{username}</span> doesn&apos;t exist or is
        set to private.
      </p>

      <Link
        href="/"
        className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis mt-8 inline-flex h-10 items-center rounded-lg px-5 text-sm font-medium transition-opacity hover:opacity-90"
      >
        {t('social.profile.goHome' as Parameters<typeof t>[0])}
      </Link>
    </div>
  );
}
