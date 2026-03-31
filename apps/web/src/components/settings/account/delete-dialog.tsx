/**
 * DeleteDialog — confirmation dialog for permanent account deletion.
 * Uses SDK hooks directly - no manual hooks.
 */

'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  showToast,
} from '@octopus-synapse/profile-ui';
import { useDeleteAccountHandle } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { useState } from 'react';

const DELETION_PHRASE = 'DELETE MY ACCOUNT';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: () => Promise<void>;
}

export function DeleteDialog({ open, onOpenChange, onSuccess }: Props) {
  const { t } = useI18n();
  const [confirmation, setConfirmation] = useState('');
  const deleteAccount = useDeleteAccountHandle();
  const isConfirmed = confirmation === DELETION_PHRASE;

  async function handleDelete() {
    if (!isConfirmed) return;
    try {
      await deleteAccount.mutateAsync({ data: { confirmationPhrase: DELETION_PHRASE } });
      showToast.success(t('settings.danger.delete.success'));
      onOpenChange(false);
      await onSuccess();
    } catch {
      showToast.error(t('settings.danger.delete.error'));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">
            {t('settings.danger.delete.dialogTitle')}
          </DialogTitle>
          <DialogDescription>{t('settings.danger.delete.dialogDesc')}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-2">
          <p className="text-pf-fg-muted text-sm">
            {t('settings.danger.delete.confirmPrompt', { phrase: DELETION_PHRASE })}
          </p>
          <Input
            value={confirmation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmation(e.target.value)}
            placeholder={DELETION_PHRASE}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('action.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmed || deleteAccount.isPending}
          >
            {deleteAccount.isPending
              ? t('settings.danger.delete.deleting')
              : t('settings.danger.delete.deleteForever')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
