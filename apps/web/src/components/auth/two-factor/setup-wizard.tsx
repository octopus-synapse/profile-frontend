'use client';

/**
 * Two-Factor Authentication Setup Wizard
 *
 * Multi-step flow: QR code → TOTP verification → backup codes display.
 */

import { useT } from '@profile/i18n';
import { Copy, KeyRound, QrCode, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button, Input } from '@/shared/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { showToast } from '@/shared/components/ui/toast';
import { copyToClipboard } from '@/shared/lib/clipboard';
import { useSetup2FA, useVerify2FA } from '../hooks/use-2fa';

type Step = 'qr' | 'verify' | 'backup';

interface SetupWizardProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function TwoFactorSetupWizard({ open, onOpenChange }: SetupWizardProps) {
  const t = useT();
  const [step, setStep] = useState<Step>('qr');
  const [totpCode, setTotpCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const setup = useSetup2FA();
  const verify = useVerify2FA();

  function handleOpen(v: boolean) {
    if (v && !setup.data) setup.mutate(undefined);
    if (!v) resetState();
    onOpenChange(v);
  }

  function resetState() {
    setStep('qr');
    setTotpCode('');
    setBackupCodes([]);
    setup.reset();
    verify.reset();
  }

  async function handleVerify() {
    if (totpCode.length !== 6) return;
    try {
      const result = await verify.mutateAsync({ token: totpCode });
      setBackupCodes(result.backupCodes);
      setStep('backup');
      showToast.success(t('auth.2fa.enabled'));
    } catch {
      showToast.error(t('auth.2fa.invalidCode'), t('auth.2fa.checkApp'));
    }
  }

  async function copyBackupCodes() {
    const success = await copyToClipboard(backupCodes.join('\n'));
    if (success) {
      showToast.success(t('auth.2fa.backupCopied'));
    } else {
      showToast.error(t('auth.2fa.backupCopyFailed'));
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            {step === 'qr' && t('auth.2fa.scanQr')}
            {step === 'verify' && t('auth.2fa.verifyCode')}
            {step === 'backup' && t('auth.2fa.backupCodes')}
          </DialogTitle>
          <DialogDescription>
            {step === 'qr' && t('auth.2fa.scanDescription')}
            {step === 'verify' && t('auth.2fa.verifyDescription')}
            {step === 'backup' && t('auth.2fa.backupDescription')}
          </DialogDescription>
        </DialogHeader>

        {step === 'qr' && (
          <QrStep qrCode={setup.data?.qrCode} manualKey={setup.data?.manualEntryKey} />
        )}
        {step === 'verify' && (
          <VerifyStep code={totpCode} onChange={setTotpCode} isPending={verify.isPending} />
        )}
        {step === 'backup' && <BackupStep codes={backupCodes} onCopy={copyBackupCodes} />}

        <DialogFooter>
          {step === 'qr' && (
            <Button onClick={() => setStep('verify')} disabled={!setup.data}>
              {t('action.next')}
            </Button>
          )}
          {step === 'verify' && (
            <Button onClick={handleVerify} disabled={totpCode.length !== 6 || verify.isPending}>
              {verify.isPending ? t('auth.2fa.verifying') : t('auth.2fa.verifyAndEnable')}
            </Button>
          )}
          {step === 'backup' && <Button onClick={() => handleOpen(false)}>{t('auth.2fa.done')}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Sub-components ─────────────────────────────────────

function QrStep({ qrCode, manualKey }: { qrCode?: string; manualKey?: string }) {
  const t = useT();
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {qrCode ? (
        <Image
          src={qrCode}
          alt={t('auth.2fa.qrAlt')}
          width={192}
          height={192}
          className="h-48 w-48 rounded-lg"
          unoptimized
        />
      ) : (
        <div className="bg-pf-canvas-subtle flex h-48 w-48 items-center justify-center rounded-lg">
          <QrCode className="text-pf-fg-muted h-12 w-12 animate-pulse" />
        </div>
      )}
      {manualKey && (
        <div className="text-center">
          <p className="text-pf-fg-muted mb-1 text-xs">{t('auth.2fa.manualKey')}</p>
          <code className="bg-pf-canvas-subtle rounded px-2 py-1 text-sm font-mono">
            {manualKey}
          </code>
        </div>
      )}
    </div>
  );
}

function VerifyStep({
  code,
  onChange,
  isPending,
}: {
  code: string;
  onChange: (v: string) => void;
  isPending: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <KeyRound className="text-pf-fg-muted h-10 w-10" />
      <Input
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="000000"
        value={code}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value.replace(/\D/g, '').slice(0, 6))
        }
        className="text-center text-2xl tracking-[0.3em] font-mono max-w-[200px]"
        disabled={isPending}
        autoFocus
      />
    </div>
  );
}

function BackupStep({ codes, onCopy }: { codes: string[]; onCopy: () => void }) {
  const t = useT();
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="bg-pf-canvas-subtle grid grid-cols-2 gap-2 rounded-lg p-4">
        {codes.map((code) => (
          <code key={code} className="text-pf-fg-default text-sm font-mono text-center">
            {code}
          </code>
        ))}
      </div>
      <Button variant="outline" onClick={onCopy} className="gap-2">
        <Copy className="h-4 w-4" />
        {t('auth.2fa.copyAll')}
      </Button>
      <p className="text-pf-fg-muted text-xs text-center">
        {t('auth.2fa.backupWarning')}
      </p>
    </div>
  );
}
