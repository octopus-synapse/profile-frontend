'use client';

import { apiFetch, RESUMES_ROUTES } from '@profile/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CACHE_TIMES } from '@/shared/constants/cache-times';

// ============================================================================
// Types
// ============================================================================

export interface ShareLink {
  id: string;
  resumeId: string;
  slug: string;
  url: string;
  password: string | null;
  expiresAt: string | null;
  createdAt: string;
}

interface CreateShareLinkInput {
  slug?: string;
  password?: string;
  expiresAt?: string;
}

// ============================================================================
// Query Key Factory
// ============================================================================

export const shareLinksKeys = {
  all: ['shareLinks'] as const,
  byResume: (resumeId: string) => [...shareLinksKeys.all, 'resume', resumeId] as const,
};

// ============================================================================
// Queries
// ============================================================================

export function useShareLinks(resumeId: string) {
  return useQuery({
    queryKey: shareLinksKeys.byResume(resumeId),
    queryFn: () => apiFetch.get<ShareLink[]>(`/api/v1/shares/resume/${resumeId}`),
    staleTime: CACHE_TIMES.SHORT,
    enabled: !!resumeId,
  });
}

// ============================================================================
// Mutations
// ============================================================================

export function useCreateShareLink(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateShareLinkInput) =>
      apiFetch.post<ShareLink>(RESUMES_ROUTES.RESUMES_CREATE_SHARE, {
        resumeId,
        ...input,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: shareLinksKeys.byResume(resumeId),
      });
    },
  });
}

export function useDeleteShareLink(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shareId: string) => apiFetch.delete<void>(`/api/v1/shares/${shareId}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: shareLinksKeys.byResume(resumeId),
      });
    },
  });
}
