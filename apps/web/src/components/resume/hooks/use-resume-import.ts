'use client';

import type { ImportJobDtoSource, ImportJobDtoStatus } from '@profile/api-client';
import { apiFetch, RESUME_IMPORT_ROUTES } from '@profile/api-client';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { resumeKeys } from './query-keys';

// ============================================================================
// Types
// ============================================================================

export interface ImportJob {
  id: string;
  importId?: string;
  userId: string;
  source: ImportJobDtoSource;
  status: ImportJobDtoStatus;
  resumeId?: string;
  errors?: string[];
  createdAt: string;
  updatedAt?: string;
}

interface ImportJsonInput {
  data?: Record<string, unknown>;
  content?: string;
}

// ============================================================================
// Query Key Factory
// ============================================================================

export const resumeImportKeys = {
  all: ['resumeImport'] as const,
  list: () => [...resumeImportKeys.all, 'list'] as const,
  detail: (importId: string) =>
    [...resumeImportKeys.all, 'detail', importId] as const,
};

// ============================================================================
// Queries
// ============================================================================

export function useImportHistory() {
  return useQuery({
    queryKey: resumeImportKeys.list(),
    queryFn: () => apiFetch.get<ImportJob[]>(RESUME_IMPORT_ROUTES.RESUME_IMPORT_GET_HISTORY),
    staleTime: 30_000,
  });
}

const POLLING_STATUSES = new Set(['PENDING', 'PROCESSING']);

export function useImportStatus(importId: string) {
  return useQuery({
    queryKey: resumeImportKeys.detail(importId),
    queryFn: () =>
      apiFetch.get<ImportJob>(`/api/resume-import/${importId}`),
    staleTime: 30_000,
    enabled: !!importId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && POLLING_STATUSES.has(status) ? 3_000 : false;
    },
  });
}

// ============================================================================
// Mutations
// ============================================================================

export function useImportJson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ImportJsonInput) =>
      apiFetch.post<ImportJob>(RESUME_IMPORT_ROUTES.RESUME_IMPORT_IMPORT_JSON, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: resumeImportKeys.list(),
      });
      void queryClient.invalidateQueries({
        queryKey: resumeKeys.lists(),
      });
    },
  });
}

export function useParseJson() {
  return useMutation({
    mutationFn: async (input: ImportJsonInput) =>
      apiFetch.post<Record<string, unknown>>(
        RESUME_IMPORT_ROUTES.RESUME_IMPORT_PARSE_JSON,
        input,
      ),
  });
}

export function useCancelImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (importId: string) =>
      apiFetch.delete(`/api/resume-import/${importId}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: resumeImportKeys.list(),
      });
    },
  });
}

export function useRetryImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (importId: string) =>
      apiFetch.post<ImportJob>(
        `/api/resume-import/${importId}/retry`,
      ),
    onSuccess: (_data, importId) => {
      void queryClient.invalidateQueries({
        queryKey: resumeImportKeys.detail(importId),
      });
      void queryClient.invalidateQueries({
        queryKey: resumeImportKeys.list(),
      });
    },
  });
}
