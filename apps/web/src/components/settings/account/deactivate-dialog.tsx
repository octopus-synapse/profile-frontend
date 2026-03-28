/**
 * DeactivateDialog — confirmation dialog for account deactivation.
 * Uses SDK hooks directly - no manual hooks.
 */

'use client';

import { useDeactivateAccountHandle } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { Button } from '@/shared/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { showToast } from '@/shared/components/ui/toast';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: () => Promise<void>;
}

export function DeactivateDialog({ open, onOpenChange, onSuccess }: Props) {
  const { t } = useI18n();
  const deactivate = useDeactivateAccountHandle();

  async function handleDeactivate() {
    try {
      await deactivate.mutateAsync({ data: {} });
      showToast.success(t('settings.danger.deactivate.success'));
      onOpenChange(false);
      await onSuccess();
    } catch {
      showToast.error(t('settings.danger.deactivate.error'));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('settings.danger.deactivate.dialogTitle')}</DialogTitle>
          <DialogDescription>{t('settings.danger.deactivate.dialogDesc')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('action.cancel')}
          </Button>
          <Button variant="destructive" onClick={handleDeactivate} disabled={deactivate.isPending}>
            {deactivate.isPending
              ? t('settings.danger.deactivate.deactivating')
              : t('settings.danger.deactivate.button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
