'use client';

/**
 * Resume Mutations
 *
 * NOTE: The backend API uses generic sections instead of separate entities
 * for experience, education, skills, etc. These hooks are stubs that need
 * to be implemented using the section-based API when available.
 *
 * @see ADR-000X — Backend uses Section-based architecture
 */

import {
  useResumesCreateResumeForUser,
  useResumesDeleteResumeForUser,
  useResumesUpdateResumeForUser,
} from '@profile/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeKeys } from './query-keys';

// ============================================================================
// Resume CRUD - Using SDK hooks directly
// ============================================================================

export function useCreateResume() {
  const queryClient = useQueryClient();
  const mutation = useResumesCreateResumeForUser();

  return {
    ...mutation,
    mutateAsync: async () => {
      const result = await mutation.mutateAsync();
      void queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      return result;
    },
  };
}

export function useUpdateResume(resumeId: string) {
  const queryClient = useQueryClient();
  const mutation = useResumesUpdateResumeForUser();

  return {
    ...mutation,
    mutateAsync: async () => {
      const result = await mutation.mutateAsync({ id: resumeId });
      void queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(resumeId),
      });
      void queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      return result;
    },
  };
}

export function useDeleteResume() {
  const queryClient = useQueryClient();
  const mutation = useResumesDeleteResumeForUser();

  return {
    ...mutation,
    mutateAsync: async (resumeId: string) => {
      const result = await mutation.mutateAsync({ id: resumeId });
      void queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      return result;
    },
  };
}

export function useDuplicateResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_resumeId: string) => {
      // TODO: Implement when duplicate endpoint is available
      throw new Error('Duplicate resume not yet implemented');
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
}

// ============================================================================
// Export - Stubs
// ============================================================================

export function useExportResumePDF() {
  return useMutation({
    mutationFn: async (_resumeId: string) => {
      // TODO: Implement when export endpoint is available in SDK
      throw new Error('Export PDF not yet implemented');
    },
  });
}

export function useExportResumeDOCX() {
  return useMutation({
    mutationFn: async (_resumeId: string) => {
      // TODO: Implement when export endpoint is available in SDK
      throw new Error('Export DOCX not yet implemented');
    },
  });
}
