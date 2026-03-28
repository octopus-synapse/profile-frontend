'use client';

/**
 * Two-Factor Settings — Minimal design
 */

import { useI18n } from '@profile/i18n';
import { Copy, KeyRound, Loader2, ShieldCheck, ShieldOff } from 'lucide-react';
import { useState } from 'react';
import {
  use2FAStatus,
  useDisable2FA,
  useRegenerateBackupCodes,
} from '@/components/auth/hooks/use-2fa';
import { TwoFactorSetupWizard } from '@/components/auth/two-factor/setup-wizard';
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

export function TwoFactorSettings() {
  const { t } = useI18n();
  const { data: status, isLoading } = use2FAStatus();
  const [setupOpen, setSetupOpen] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);
  const [regenOpen, setRegenOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-12">
        <div>
          <h2 className="text-xl font-light text-white">{t('settings.twoFactor.title')}</h2>
          <p className="mt-1 text-[13px] text-zinc-500">{t('settings.twoFactor.description')}</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-zinc-600" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-12">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-light text-white">{t('settings.twoFactor.title')}</h2>
            <p className="mt-1 text-[13px] text-zinc-500">{t('settings.twoFactor.description')}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-medium ${
              status?.enabled ? 'bg-emerald-950/50 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {status?.enabled ? t('settings.twoFactor.enabled') : t('settings.twoFactor.disabled')}
          </span>
        </div>

        {/* Content */}
        <div className="border-t border-zinc-800/50 pt-8">
          {status?.enabled ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-950/30">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm text-white">
                    {t('settings.twoFactor.backupCodesRemaining')}
                  </p>
                  <p className="text-2xl font-light text-white">{status.backupCodesRemaining}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRegenOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-[13px] text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
                >
                  <KeyRound className="h-4 w-4" />
                  <span>{t('settings.twoFactor.regenerateBackup')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDisableOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-red-900/50 px-4 py-2 text-[13px] text-red-400 transition-colors hover:border-red-800 hover:bg-red-950/20"
                >
                  <ShieldOff className="h-4 w-4" />
                  <span>{t('settings.twoFactor.disable')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900">
                  <ShieldOff className="h-5 w-5 text-zinc-500" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-zinc-400">{t('settings.twoFactor.notEnabled')}</p>
              </div>
              <button
                type="button"
                onClick={() => setSetupOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>{t('settings.twoFactor.enable')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <TwoFactorSetupWizard open={setupOpen} onOpenChange={setSetupOpen} />
      <DisableConfirmDialog open={disableOpen} onOpenChange={setDisableOpen} />
      <RegenerateCodesDialog open={regenOpen} onOpenChange={setRegenOpen} />
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
          <DialogDescription>{t('settings.twoFactor.disableDialogDesc')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('action.cancel')}
          </Button>
          <Button variant="destructive" onClick={handleDisable} disabled={disable.isPending}>
            {disable.isPending
              ? t('settings.twoFactor.disabling')
              : t('settings.twoFactor.disable')}
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
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-zinc-900 p-4">
              {regen.data.backupCodes.map((code) => (
                <code key={code} className="text-center font-mono text-sm text-white">
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
                {regen.isPending
                  ? t('settings.twoFactor.generating')
                  : t('settings.twoFactor.regenerate')}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
