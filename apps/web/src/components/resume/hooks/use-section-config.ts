/**
 * Section Config Mutation Hooks
 *
 * Uses @profile/api-client SDK hooks directly.
 */

import {
  useResumeConfigBatchUpdate,
  useResumeConfigReorderItem,
  useResumeConfigReorderSection,
  useResumeConfigToggleItem,
  useResumeConfigToggleSection,
} from '@profile/api-client';
import { useQueryClient } from '@tanstack/react-query';

export function useToggleSection(resumeId: string) {
  const queryClient = useQueryClient();
  const mutation = useResumeConfigToggleSection();

  return {
    ...mutation,
    mutateAsync: async ({ sectionId, visible }: { sectionId: string; visible: boolean }) => {
      const result = await mutation.mutateAsync({
        resumeId,
        sectionId,
        data: { visible },
      });
      void queryClient.invalidateQueries({ queryKey: ['resumes', resumeId] });
      return result;
    },
  };
}

export function useReorderSection(resumeId: string) {
  const queryClient = useQueryClient();
  const mutation = useResumeConfigReorderSection();

  return {
    ...mutation,
    mutateAsync: async ({ sectionId, order }: { sectionId: string; order: number }) => {
      const result = await mutation.mutateAsync({
        resumeId,
        sectionId,
        data: { order },
      });
      void queryClient.invalidateQueries({ queryKey: ['resumes', resumeId] });
      return result;
    },
  };
}

export function useToggleItem(resumeId: string) {
  const queryClient = useQueryClient();
  const mutation = useResumeConfigToggleItem();

  return {
    ...mutation,
    mutateAsync: async ({
      sectionId,
      itemId,
      visible,
    }: {
      sectionId: string;
      itemId: string;
      visible: boolean;
    }) => {
      const result = await mutation.mutateAsync({
        resumeId,
        sectionId,
        data: { itemId, visible },
      });
      void queryClient.invalidateQueries({ queryKey: ['resumes', resumeId] });
      return result;
    },
  };
}

export function useReorderItem(resumeId: string) {
  const queryClient = useQueryClient();
  const mutation = useResumeConfigReorderItem();

  return {
    ...mutation,
    mutateAsync: async ({
      sectionId,
      itemId,
      order,
    }: {
      sectionId: string;
      itemId: string;
      order: number;
    }) => {
      const result = await mutation.mutateAsync({
        resumeId,
        sectionId,
        data: { itemId, order },
      });
      void queryClient.invalidateQueries({ queryKey: ['resumes', resumeId] });
      return result;
    },
  };
}

export function useBatchUpdateSections(resumeId: string) {
  const queryClient = useQueryClient();
  const mutation = useResumeConfigBatchUpdate();

  return {
    ...mutation,
    mutateAsync: async (sections: Array<{ id: string; visible?: boolean; order?: number }>) => {
      // The new API only supports single section updates
      // We'll update each section individually
      const results = [];
      for (const s of sections) {
        const result = await mutation.mutateAsync({
          resumeId,
          data: {
            id: s.id,
            visible: s.visible,
          },
        });
        results.push(result);
      }
      void queryClient.invalidateQueries({ queryKey: ['resumes', resumeId] });
      return results;
    },
  };
}
