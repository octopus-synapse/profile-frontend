'use client';

/**
 * Two-Factor Settings Panel
 *
 * Displays 2FA status and provides enable/disable/regenerate actions.
 */

import { useI18n } from '@profile/i18n';
import { Copy, KeyRound, ShieldCheck, ShieldOff } from 'lucide-react';
import { useState } from 'react';
import {
  use2FAStatus,
  useDisable2FA,
  useRegenerateBackupCodes,
} from '@/components/auth/hooks/use-2fa';
import { TwoFactorSetupWizard } from '@/components/auth/two-factor/setup-wizard';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

export function TwoFactorSettings() {
  const { t } = useI18n();
  const { data: status, isLoading } = use2FAStatus();
  const [setupOpen, setSetupOpen] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);
  const [regenOpen, setRegenOpen] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            {t('settings.twoFactor.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-pf-canvas-subtle h-20 animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                {t('settings.twoFactor.title')}
              </CardTitle>
              <CardDescription>{t('settings.twoFactor.description')}</CardDescription>
            </div>
            <Badge variant={status?.enabled ? 'default' : 'secondary'}>
              {status?.enabled ? t('settings.twoFactor.enabled') : t('settings.twoFactor.disabled')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {status?.enabled ? (
            <EnabledView
              backupCodesRemaining={status.backupCodesRemaining}
              onDisable={() => setDisableOpen(true)}
              onRegenerate={() => setRegenOpen(true)}
            />
          ) : (
            <Button onClick={() => setSetupOpen(true)} className="gap-2 self-start">
              <ShieldCheck className="h-4 w-4" />
              {t('settings.twoFactor.enable')}
            </Button>
          )}
        </CardContent>
      </Card>

      <TwoFactorSetupWizard open={setupOpen} onOpenChange={setSetupOpen} />
      <DisableConfirmDialog open={disableOpen} onOpenChange={setDisableOpen} />
      <RegenerateCodesDialog open={regenOpen} onOpenChange={setRegenOpen} />
    </>
  );
}

// ── Sub-components ─────────────────────────────────────

function EnabledView({
  backupCodesRemaining,
  onDisable,
  onRegenerate,
}: {
  backupCodesRemaining: number;
  onDisable: () => void;
  onRegenerate: () => void;
}) {
  const { t } = useI18n();

  return (
    <>
      <p className="text-pf-fg-muted text-sm">
        {t('settings.twoFactor.backupCodesRemaining')} <strong>{backupCodesRemaining}</strong>
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRegenerate} className="gap-2">
          <KeyRound className="h-4 w-4" />
          {t('settings.twoFactor.regenerateBackup')}
        </Button>
        <Button variant="outline" onClick={onDisable} className="gap-2 text-red-600">
          <ShieldOff className="h-4 w-4" />
          {t('settings.twoFactor.disable')}
        </Button>
      </div>
    </>
  );
}

function DisableConfirmDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useI18n();
  const disable = useDisable2FA();

  async function handleDisable() {
    try {
      await disable.mutateAsync();
      showToast.success(t('settings.twoFactor.disableSuccess'));
      onOpenChange(false);
    } catch {
      showToast.error(t('settings.twoFactor.disableError'));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('settings.twoFactor.disableDialogTitle')}</DialogTitle>
          <DialogDescription>
            {t('settings.twoFactor.disableDialogDesc')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('action.cancel')}
          </Button>
          <Button variant="destructive" onClick={handleDisable} disabled={disable.isPending}>
            {disable.isPending ? t('settings.twoFactor.disabling') : t('settings.twoFactor.disable')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RegenerateCodesDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useI18n();
  const regen = useRegenerateBackupCodes();

  async function handleRegenerate() {
    try {
      await regen.mutateAsync();
      showToast.success(t('settings.twoFactor.regenSuccess'));
    } catch {
      showToast.error(t('settings.twoFactor.regenError'));
    }
  }

  async function copyBackupCodes() {
    if (!regen.data) return;
    const { copyToClipboard } = await import('@/shared/lib/clipboard');
    const success = await copyToClipboard(regen.data.backupCodes.join('\n'));
    if (success) {
      showToast.success(t('settings.twoFactor.copySuccess'));
    } else {
      showToast.error(t('settings.twoFactor.copyError'));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('settings.twoFactor.regenDialogTitle')}</DialogTitle>
          <DialogDescription>
            {regen.data
              ? t('settings.twoFactor.regenDialogDescAfter')
              : t('settings.twoFactor.regenDialogDescBefore')}
          </DialogDescription>
        </DialogHeader>
        {regen.data ? (
          <div className="flex flex-col gap-3">
            <div className="bg-pf-canvas-subtle grid grid-cols-2 gap-2 rounded-lg p-4">
              {regen.data.backupCodes.map((code) => (
                <code key={code} className="text-sm font-mono text-center">
                  {code}
                </code>
              ))}
            </div>
            <Button variant="outline" onClick={copyBackupCodes} className="gap-2">
              <Copy className="h-4 w-4" />
              {t('settings.twoFactor.copyAllCodes')}
            </Button>
          </div>
        ) : null}
        <DialogFooter>
          {regen.data ? (
            <Button onClick={() => onOpenChange(false)}>{t('settings.twoFactor.done')}</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t('action.cancel')}
              </Button>
              <Button onClick={handleRegenerate} disabled={regen.isPending}>
                {regen.isPending ? t('settings.twoFactor.generating') : t('settings.twoFactor.regenerate')}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
