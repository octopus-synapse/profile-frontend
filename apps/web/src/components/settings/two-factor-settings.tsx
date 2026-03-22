'use client';

/**
 * Two-Factor Settings Panel
 *
 * Displays 2FA status and provides enable/disable/regenerate actions.
 */

import { useState } from 'react';
import { Copy, KeyRound, ShieldCheck, ShieldOff } from 'lucide-react';
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
import {
  use2FAStatus,
  useDisable2FA,
  useRegenerateBackupCodes,
} from '@/components/auth/hooks/use-2fa';
import { TwoFactorSetupWizard } from '@/components/auth/two-factor/setup-wizard';

export function TwoFactorSettings() {
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
            Two-Factor Authentication
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
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </div>
            <Badge variant={status?.enabled ? 'default' : 'secondary'}>
              {status?.enabled ? 'Enabled' : 'Disabled'}
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
              Enable 2FA
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
  return (
    <>
      <p className="text-pf-fg-muted text-sm">
        Backup codes remaining: <strong>{backupCodesRemaining}</strong>
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRegenerate} className="gap-2">
          <KeyRound className="h-4 w-4" />
          Regenerate Backup Codes
        </Button>
        <Button variant="outline" onClick={onDisable} className="gap-2 text-red-600">
          <ShieldOff className="h-4 w-4" />
          Disable 2FA
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
  const disable = useDisable2FA();

  async function handleDisable() {
    try {
      await disable.mutateAsync();
      showToast.success('Two-factor authentication disabled');
      onOpenChange(false);
    } catch {
      showToast.error('Failed to disable 2FA');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disable Two-Factor Authentication?</DialogTitle>
          <DialogDescription>
            This will remove the extra security layer from your account. You can re-enable it
            at any time.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDisable}
            disabled={disable.isPending}
          >
            {disable.isPending ? 'Disabling…' : 'Disable 2FA'}
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
  const regen = useRegenerateBackupCodes();

  async function handleRegenerate() {
    try {
      await regen.mutateAsync();
      showToast.success('New backup codes generated');
    } catch {
      showToast.error('Failed to regenerate backup codes');
    }
  }

  async function copyBackupCodes() {
    if (!regen.data) return;
    const { copyToClipboard } = await import('@/shared/lib/clipboard');
    const success = await copyToClipboard(regen.data.backupCodes.join('\n'));
    if (success) {
      showToast.success('Backup codes copied to clipboard');
    } else {
      showToast.error('Failed to copy backup codes');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Regenerate Backup Codes</DialogTitle>
          <DialogDescription>
            {regen.data
              ? 'Save these new backup codes. Previous codes are now invalid.'
              : 'This will invalidate all existing backup codes.'}
          </DialogDescription>
        </DialogHeader>
        {regen.data ? (
          <div className="flex flex-col gap-3">
            <div className="bg-pf-canvas-subtle grid grid-cols-2 gap-2 rounded-lg p-4">
              {regen.data.backupCodes.map((code) => (
                <code key={code} className="text-sm font-mono text-center">{code}</code>
              ))}
            </div>
            <Button variant="outline" onClick={copyBackupCodes} className="gap-2">
              <Copy className="h-4 w-4" />
              Copy all codes
            </Button>
          </div>
        ) : null}
        <DialogFooter>
          {regen.data ? (
            <Button onClick={() => onOpenChange(false)}>Done</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleRegenerate} disabled={regen.isPending}>
                {regen.isPending ? 'Generating…' : 'Regenerate'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
