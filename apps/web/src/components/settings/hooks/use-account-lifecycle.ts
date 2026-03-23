'use client';

/**
 * Account Lifecycle Hooks
 *
 * Deactivation, data export, and permanent deletion (GDPR Article 17).
 */

import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@profile/api-client';

// ── Types ──────────────────────────────────────────────

interface DataExportResponse {
  personalInfo: Record<string, unknown>;
  consents: Record<string, unknown>[];
  resumes: Record<string, unknown>[];
  auditLogs: Record<string, unknown>[];
  retentionPolicy: string;
}

// ── Mutations ──────────────────────────────────────────

export function useDeactivateAccount() {
  return useMutation<void>({
    mutationFn: () => apiFetch.delete('/api/v1/accounts/deactivate'),
  });
}

export function useRequestDataExport() {
  return useMutation<DataExportResponse>({
    mutationFn: () => apiFetch.get<DataExportResponse>('/api/v1/gdpr/export'),
  });
}

export function useDeleteAccount() {
  return useMutation<void, Error, { confirmationPhrase: string }>({
    mutationFn: ({ confirmationPhrase }) =>
      apiFetch.post<void>('/api/v1/accounts/delete', { confirmationPhrase }),
  });
}
