/**
 * UsernameActionButtons - save/cancel buttons for username editing.
 */

'use client';

import { Button, SaveButton } from '@octopus-synapse/profile-ui';
import { useI18n } from '@profile/i18n';

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
      <SaveButton isPending={isPending} disabled={!canSave} onClick={onSave}>
        {t('action.save')}
      </SaveButton>
      <Button
        type="button"
        variant="ghost"
        tone="neutral"
        size="md"
        disabled={isPending}
        onPress={onCancel}
      >
        {t('action.cancel')}
      </Button>
    </div>
  );
}
