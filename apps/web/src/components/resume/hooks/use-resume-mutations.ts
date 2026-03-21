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
  type ResumesUpdateResumeForUserMutationBody,
  useResumesCreateResumeForUser,
  useResumesDeleteResumeForUser,
  useResumesUpdateResumeForUser,
} from '@profile/api-client';
import { apiFetch } from '@profile/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/shared/components/ui/toast';
import { resumeKeys } from './query-keys';

// ============================================================================
// Resume CRUD - Using SDK hooks directly
// ============================================================================

export function useCreateResume() {
  const queryClient = useQueryClient();
  const mutation = useResumesCreateResumeForUser();

  return {
    ...mutation,
    mutateAsync: async (title: string = 'Untitled Resume') => {
      const result = await mutation.mutateAsync({ data: { title } });
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
    mutateAsync: async (data: ResumesUpdateResumeForUserMutationBody) => {
      const result = await mutation.mutateAsync({ id: resumeId, data });
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
  const createMutation = useResumesCreateResumeForUser();

  return useMutation({
    mutationFn: async (resumeId: string) => {
      // Fetch full original resume to copy all fields
      const original = await apiFetch.get<{
        title?: string;
        summary?: string;
        isPublic?: boolean;
        fullName?: string;
        jobTitle?: string;
        phone?: string;
        emailContact?: string;
        email?: string;
        location?: string;
        linkedin?: string;
        github?: string;
        website?: string;
        template?: string;
      }>(`/api/v1/resumes/${resumeId}`);

      const result = await createMutation.mutateAsync({
        data: {
          title: `${original.title ?? 'Untitled'} (Copy)`,
          summary: original.summary,
          isPublic: false,
          fullName: original.fullName,
          jobTitle: original.jobTitle,
          phone: original.phone,
          emailContact: original.emailContact ?? original.email,
          location: original.location,
          linkedin: original.linkedin,
          github: original.github,
          website: original.website,
          template: original.template,
        },
      });
      return result;
    },
    onSuccess: () => {
      showToast.success('Resume duplicated successfully');
      void queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
}
