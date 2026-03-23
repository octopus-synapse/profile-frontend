import React from 'react';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';

// ── Mutable mock state ──────────────────────────────────

let mock2FAStatusReturn: {
  data: { enabled: boolean; backupCodesRemaining: number } | undefined;
  isLoading: boolean;
};

void mock.module('@/components/auth/hooks/use-2fa', () => ({
  use2FAStatus: () => mock2FAStatusReturn,
  useDisable2FA: () => ({ mutateAsync: mock(), isPending: false }),
  useRegenerateBackupCodes: () => ({
    mutateAsync: mock(),
    isPending: false,
    data: null,
  }),
}));

void mock.module('@/components/auth/two-factor/setup-wizard', () => ({
  TwoFactorSetupWizard: () => null,
}));

import { TwoFactorSettings } from '../two-factor-settings';

// ── Tests ───────────────────────────────────────────────

describe('TwoFactorSettings', () => {
  beforeEach(() => {
    mock2FAStatusReturn = {
      data: { enabled: false, backupCodesRemaining: 0 },
      isLoading: false,
    };
  });

  it('shows the section title', () => {
    render(<TwoFactorSettings />);

    expect(screen.getByText('Two-Factor Authentication')).not.toBeNull();
  });

  it('shows description text', () => {
    render(<TwoFactorSettings />);

    expect(
      screen.getByText('Add an extra layer of security to your account.'),
    ).not.toBeNull();
  });

  it('shows "Enable 2FA" button when 2FA is disabled', () => {
    render(<TwoFactorSettings />);

    expect(screen.getByText('Enable 2FA')).not.toBeNull();
  });

  it('shows "Disabled" badge when 2FA is off', () => {
    render(<TwoFactorSettings />);

    expect(screen.getByText('Disabled')).not.toBeNull();
  });

  it('shows "Enabled" badge when 2FA is on', () => {
    mock2FAStatusReturn = {
      data: { enabled: true, backupCodesRemaining: 8 },
      isLoading: false,
    };

    render(<TwoFactorSettings />);

    expect(screen.getByText('Enabled')).not.toBeNull();
  });

  it('shows action buttons when 2FA is enabled', () => {
    mock2FAStatusReturn = {
      data: { enabled: true, backupCodesRemaining: 8 },
      isLoading: false,
    };

    render(<TwoFactorSettings />);

    expect(screen.getByText('Disable 2FA')).not.toBeNull();
    expect(screen.getByText('Regenerate Backup Codes')).not.toBeNull();
  });

  it('shows backup codes remaining count when enabled', () => {
    mock2FAStatusReturn = {
      data: { enabled: true, backupCodesRemaining: 5 },
      isLoading: false,
    };

    render(<TwoFactorSettings />);

    expect(screen.getByText('5')).not.toBeNull();
  });

  it('shows loading skeleton when checking status', () => {
    mock2FAStatusReturn = { data: undefined, isLoading: true };

    render(<TwoFactorSettings />);

    expect(screen.getByText('Two-Factor Authentication')).not.toBeNull();
    expect(screen.queryByText('Enable 2FA')).toBeNull();
    expect(screen.queryByText('Disable 2FA')).toBeNull();
  });
});
