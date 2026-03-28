/**
 * UsernameRestrictionBanner - warning when username change is locked.
 */

'use client';

import { useI18n } from '@profile/i18n';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Lock } from 'lucide-react';

interface Props {
  nextChangeDate: Date;
}

export function UsernameRestrictionBanner({ nextChangeDate }: Props) {
  const { t } = useI18n();

  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
      <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-amber-500">{t('settings.username.restricted')}</p>
        <p className="text-xs text-amber-500/80">
          You can change your username again{' '}
          {formatDistanceToNow(nextChangeDate, { addSuffix: true })}
        </p>
        <p className="flex items-center gap-1.5 text-xs text-amber-500/60">
          <Calendar className="h-3 w-3" />
          {nextChangeDate.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
