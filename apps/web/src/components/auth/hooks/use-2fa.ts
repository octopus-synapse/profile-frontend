'use client';

/**
 * Two-Factor Authentication Hooks
 *
 * Endpoints: /api/v1/auth/2fa/*
 */

import { apiFetch } from '@profile/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ── Types ──────────────────────────────────────────────

interface TwoFactorStatus {
  enabled: boolean;
  lastUsedAt: string | null;
  backupCodesRemaining: number;
}

interface SetupResponse {
  secret: string;
  qrCode: string;
  manualEntryKey: string;
}

interface VerifyResponse {
  backupCodes: string[];
}

interface RegenerateResponse {
  backupCodes: string[];
}

// ── Query Keys ─────────────────────────────────────────

export const twoFactorKeys = {
  all: ['2fa'] as const,
  status: () => [...twoFactorKeys.all, 'status'] as const,
};

// ── Queries ────────────────────────────────────────────

export function use2FAStatus() {
  return useQuery<TwoFactorStatus>({
    queryKey: twoFactorKeys.status(),
    queryFn: () => apiFetch.get<TwoFactorStatus>('/api/v1/auth/2fa/status'),
    staleTime: 60 * 1000,
  });
}

// ── Mutations ──────────────────────────────────────────

export function useSetup2FA() {
  return useMutation<SetupResponse>({
    mutationFn: () => apiFetch.post<SetupResponse>('/api/v1/auth/2fa/setup', {}),
  });
}

export function useVerify2FA() {
  const queryClient = useQueryClient();

  return useMutation<VerifyResponse, Error, { token: string }>({
    mutationFn: ({ token }) => apiFetch.post<VerifyResponse>('/api/v1/auth/2fa/verify', { token }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: twoFactorKeys.status() });
    },
  });
}

/**
 * Verifies a TOTP or backup code during login (before session exists).
 * Calls the public login/verify-2fa endpoint.
 */
export function useVerifyLogin2FA() {
  return useMutation<
    { accessToken: string; refreshToken: string; expiresIn: number; userId: string },
    Error,
    { userId: string; code: string }
  >({
    mutationFn: ({ userId, code }) =>
      apiFetch.post('/api/v1/auth/login/verify-2fa', { userId, code }),
  });
}

export function useDisable2FA() {
  const queryClient = useQueryClient();

  return useMutation<void>({
    mutationFn: () => apiFetch.delete('/api/v1/auth/2fa'),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: twoFactorKeys.status() });
    },
  });
}

export function useRegenerateBackupCodes() {
  const queryClient = useQueryClient();

  return useMutation<RegenerateResponse>({
    mutationFn: () =>
      apiFetch.post<RegenerateResponse>('/api/v1/auth/2fa/backup-codes/regenerate', {}),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: twoFactorKeys.status() });
    },
  });
}
