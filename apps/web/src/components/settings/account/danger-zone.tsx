'use client';

/**
 * Danger Zone Panel
 *
 * Account deactivation, data export, and permanent deletion.
 */

import { useCallback, useState } from 'react';
import { useI18n } from '@profile/i18n';
import { authLogout, getAuthSessionQueryKey } from '@profile/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Download, Trash2, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '@/shared/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { showToast } from '@/shared/components/ui/toast';
import {
  useDeactivateAccount,
  useDeleteAccount,
  useRequestDataExport,
} from '../hooks/use-account-lifecycle';

const DELETION_PHRASE = 'DELETE MY ACCOUNT';

export function DangerZone() {
  const { t } = useI18n();
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const dataExport = useRequestDataExport();
  const router = useRouter();
  const queryClient = useQueryClient();

  const clearSessionAndRedirect = useCallback(
    async (path: string) => {
      await authLogout({});
      await queryClient.invalidateQueries({ queryKey: getAuthSessionQueryKey() });
      router.replace(path);
    },
    [queryClient, router],
  );

  async function handleExport() {
    try {
      const data = await dataExport.mutateAsync();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `profile-data-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast.success(t('settings.danger.export.success'));
    } catch {
      showToast.error(t('settings.danger.export.error'));
    }
  }

  return (
    <Card className="border-red-200 dark:border-red-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          {t('settings.danger.title')}
        </CardTitle>
        <CardDescription>
          {t('settings.danger.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <DangerAction
          icon={Download}
          title={t('settings.danger.export.title')}
          description={t('settings.danger.export.description')}
          buttonLabel={dataExport.isPending ? t('settings.danger.export.exporting') : t('settings.danger.export.button')}
          onClick={handleExport}
          disabled={dataExport.isPending}
        />
        <DangerAction
          icon={UserX}
          title={t('settings.danger.deactivate.title')}
          description={t('settings.danger.deactivate.description')}
          buttonLabel={t('settings.danger.deactivate.button')}
          onClick={() => setDeactivateOpen(true)}
        />
        <DangerAction
          icon={Trash2}
          title={t('settings.danger.delete.title')}
          description={t('settings.danger.delete.description')}
          buttonLabel={t('settings.danger.delete.button')}
          onClick={() => setDeleteOpen(true)}
          destructive
        />
      </CardContent>

      <DeactivateDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        onSuccess={() => clearSessionAndRedirect('/auth/sign-in')}
      />
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={() => clearSessionAndRedirect('/')}
      />
    </Card>
  );
}

// ── Sub-components ─────────────────────────────────────

function DangerAction({
  icon: Icon,
  title,
  description,
  buttonLabel,
  onClick,
  disabled,
  destructive,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-red-100 p-4 dark:border-red-900/50">
      <div className="flex items-start gap-3">
        <Icon className="text-pf-fg-muted mt-0.5 h-5 w-5" />
        <div>
          <p className="text-pf-fg-default text-sm font-medium">{title}</p>
          <p className="text-pf-fg-muted text-xs">{description}</p>
        </div>
      </div>
      <Button
        variant={destructive ? 'destructive' : 'outline'}
        size="sm"
        onClick={onClick}
        disabled={disabled}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}

function DeactivateDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: () => Promise<void>;
}) {
  const { t } = useI18n();
  const deactivate = useDeactivateAccount();

  async function handleDeactivate() {
    try {
      await deactivate.mutateAsync();
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
          <DialogDescription>
            {t('settings.danger.deactivate.dialogDesc')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('action.cancel')}</Button>
          <Button
            variant="destructive"
            onClick={handleDeactivate}
            disabled={deactivate.isPending}
          >
            {deactivate.isPending ? t('settings.danger.deactivate.deactivating') : t('settings.danger.deactivate.button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: () => Promise<void>;
}) {
  const { t } = useI18n();
  const [confirmation, setConfirmation] = useState('');
  const deleteAccount = useDeleteAccount();
  const isConfirmed = confirmation === DELETION_PHRASE;

  async function handleDelete() {
    if (!isConfirmed) return;
    try {
      await deleteAccount.mutateAsync({ confirmationPhrase: DELETION_PHRASE });
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
          <DialogTitle className="text-red-600">{t('settings.danger.delete.dialogTitle')}</DialogTitle>
          <DialogDescription>
            {t('settings.danger.delete.dialogDesc')}
          </DialogDescription>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('action.cancel')}</Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmed || deleteAccount.isPending}
          >
            {deleteAccount.isPending ? t('settings.danger.delete.deleting') : t('settings.danger.delete.deleteForever')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
