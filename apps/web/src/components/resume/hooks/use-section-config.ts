/**
 * Section Config Mutation Hooks
 *
 * Uses @profile/api-client for all API calls.
 * This ensures web and mobile share the same implementation.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";

export function useToggleSection(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, visible }: { sectionId: string; visible: boolean }) =>
      apiClient.sectionConfig.toggleSection(resumeId, sectionId, visible),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["resumes", resumeId] });
    },
  });
}

export function useReorderSection(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, order }: { sectionId: string; order: number }) =>
      apiClient.sectionConfig.reorderSection(resumeId, sectionId, order),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["resumes", resumeId] });
    },
  });
}

export function useToggleItem(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { sectionId: string; itemId: string; visible: boolean }) =>
      apiClient.sectionConfig.toggleItem(resumeId, args.sectionId, args.itemId, args.visible),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["resumes", resumeId] });
    },
  });
}

export function useReorderItem(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { sectionId: string; itemId: string; order: number }) =>
      apiClient.sectionConfig.reorderItem(resumeId, args.sectionId, args.itemId, args.order),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["resumes", resumeId] });
    },
  });
}

export function useBatchUpdateSections(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sections: Array<{ id: string; visible?: boolean; order?: number }>) =>
      apiClient.sectionConfig.batchUpdate(resumeId, sections),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["resumes", resumeId] });
    },
  });
}
