'use client';

/**
 * Two-Factor Login Challenge
 *
 * Shown after successful password login when 2FA is enabled.
 * Supports TOTP code and backup code entry.
 */

import { Button, Input, showToast } from '@octopus-synapse/profile-ui';
import { useAuthLoginVerify2fa } from '@profile/api-client';
import { useT } from '@profile/i18n';
import { KeyRound, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

interface LoginChallengeProps {
  userId: string;
  onVerified: () => void;
}

export function TwoFactorLoginChallenge({ userId, onVerified }: LoginChallengeProps) {
  const t = useT();
  const [mode, setMode] = useState<'totp' | 'backup'>('totp');
  const [totpCode, setTotpCode] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const verify = useAuthLoginVerify2fa();

  const code = mode === 'totp' ? totpCode : backupCode;
  const isValid = mode === 'totp' ? totpCode.length === 6 : backupCode.length >= 6;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    try {
      await verify.mutateAsync({ data: { userId, code } });
      onVerified();
    } catch {
      showToast.error(
        t('auth.2fa.verificationFailed'),
        mode === 'totp' ? t('auth.2fa.invalidTotp') : t('auth.2fa.invalidBackup'),
      );
    }
  }

  function toggleMode() {
    setMode((m) => (m === 'totp' ? 'backup' : 'totp'));
    setTotpCode('');
    setBackupCode('');
    verify.reset();
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-pf-canvas-subtle flex h-14 w-14 items-center justify-center rounded-full">
          <ShieldAlert className="text-pf-fg-muted h-7 w-7" />
        </div>
        <h2 className="text-pf-fg-default text-xl font-semibold">{t('auth.2fa.title')}</h2>
        <p className="text-pf-fg-muted text-center text-sm">
          {mode === 'totp' ? t('auth.2fa.totpPrompt') : t('auth.2fa.backupPrompt')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        {mode === 'totp' ? (
          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={totpCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            className="text-center text-2xl tracking-[0.3em] font-mono"
            disabled={verify.isPending}
            autoFocus
          />
        ) : (
          <Input
            type="text"
            placeholder={t('auth.2fa.backupPlaceholder')}
            value={backupCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setBackupCode(e.target.value.trim())
            }
            className="text-center font-mono"
            disabled={verify.isPending}
            autoFocus
          />
        )}

        <Button type="submit" disabled={!isValid || verify.isPending} className="w-full gap-2">
          <KeyRound className="h-4 w-4" />
          {verify.isPending ? t('auth.2fa.verifying') : t('auth.2fa.verify')}
        </Button>
      </form>

      <Button type="button" variant="link" tone="neutral" size="sm" onPress={toggleMode}>
        {mode === 'totp' ? t('auth.2fa.useBackup') : t('auth.2fa.useAuthenticator')}
      </Button>
    </div>
  );
}
