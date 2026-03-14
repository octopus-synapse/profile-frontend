/**
 * Section Config Mutation Hooks
 *
 * Uses @profile/api-client SDK hooks directly.
 */

import {
  useSectionConfigBatchUpdate,
  useSectionConfigReorderItem,
  useSectionConfigReorderSection,
  useSectionConfigToggleItem,
  useSectionConfigToggleSection,
} from '@profile/api-client';
import { useQueryClient } from '@tanstack/react-query';

export function useToggleSection(resumeId: string) {
  const queryClient = useQueryClient();
  const mutation = useSectionConfigToggleSection();

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
  const mutation = useSectionConfigReorderSection();

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
  const mutation = useSectionConfigToggleItem();

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
  const mutation = useSectionConfigReorderItem();

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
  const mutation = useSectionConfigBatchUpdate();

  return {
    ...mutation,
    mutateAsync: async (sections: Array<{ id: string; visible?: boolean; order?: number }>) => {
      const result = await mutation.mutateAsync({
        resumeId,
        data: {
          sections: sections.map((s) => ({
            sectionKey: s.id,
            visible: s.visible,
            order: s.order,
          })),
        },
      });
      void queryClient.invalidateQueries({ queryKey: ['resumes', resumeId] });
      return result;
    },
  };
}
