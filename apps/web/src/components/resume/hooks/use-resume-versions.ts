'use client';

import { apiFetch } from '@profile/api-client';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { resumeKeys } from './query-keys';

// ============================================================================
// Types
// ============================================================================

export interface VersionItem {
  id: string;
  versionNumber: number;
  label: string | null;
  createdAt: string;
}

// ============================================================================
// Query Key Factory
// ============================================================================

export const resumeVersionKeys = {
  all: (resumeId: string) => ['resumeVersions', resumeId] as const,
  list: (resumeId: string) =>
    [...resumeVersionKeys.all(resumeId), 'list'] as const,
  detail: (resumeId: string, versionId: string) =>
    [...resumeVersionKeys.all(resumeId), 'detail', versionId] as const,
};

// ============================================================================
// Queries
// ============================================================================

export function useResumeVersions(resumeId: string) {
  return useQuery({
    queryKey: resumeVersionKeys.list(resumeId),
    queryFn: async () => {
      const result = await apiFetch.get<{ versions: VersionItem[] }>(
        `/api/v1/resumes/${resumeId}/versions`,
      );
      return result.versions;
    },
    staleTime: 30_000,
    enabled: !!resumeId,
  });
}

export function useResumeVersion(resumeId: string, versionId: string) {
  return useQuery({
    queryKey: resumeVersionKeys.detail(resumeId, versionId),
    queryFn: async () => {
      const result = await apiFetch.get<{ version: VersionItem }>(
        `/api/v1/versions/${resumeId}/${versionId}`,
      );
      return result.version;
    },
    staleTime: 30_000,
    enabled: !!resumeId && !!versionId,
  });
}

// ============================================================================
// Mutations
// ============================================================================

export function useRestoreVersion(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (versionId: string) =>
      apiFetch.post<{ success: boolean; restoredFrom: string }>(
        `/api/v1/resumes/${resumeId}/versions/${versionId}/restore`,
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: resumeVersionKeys.all(resumeId),
      });
      void queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(resumeId),
      });
    },
  });
}
