/**
 * UsernameActionButtons - save/cancel buttons for username editing.
 */

'use client';

import { useI18n } from '@profile/i18n';
import { Check } from 'lucide-react';
import { SaveButton } from '@/shared/components/ui';

interface Props {
  canSave: boolean;
  isPending: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function UsernameActionButtons({ canSave, isPending, onSave, onCancel }: Props) {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-2">
      <SaveButton icon={Check} isPending={isPending} disabled={!canSave} onClick={onSave}>
        Save
      </SaveButton>
      <button
        type="button"
        onClick={onCancel}
        disabled={isPending}
        className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
      >
        {t('action.cancel')}
      </button>
    </div>
  );
}
