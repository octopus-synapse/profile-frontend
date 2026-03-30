/**
 * RestoreConfirmDialog — confirmation dialog for restoring a version.
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
  Separator,
} from '@octopus-synapse/profile-ui';
import { useI18n } from '@profile/i18n';

interface Props {
  versionLabel: string | null;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RestoreConfirmDialog({ versionLabel, isPending, onConfirm, onCancel }: Props) {
  const { t } = useI18n();

  return (
    <Dialog
      open={versionLabel !== null}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('resume.versions.restoreConfirmTitle', { version: versionLabel ?? '' })}
          </DialogTitle>
          <DialogDescription>{t('resume.versions.restoreConfirmDesc')}</DialogDescription>
        </DialogHeader>
        <Separator className="bg-white/10" />
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            {t('action.cancel')}
          </Button>
          <Button variant="primary" size="sm" loading={isPending} onClick={onConfirm}>
            {t('resume.versions.restore')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
