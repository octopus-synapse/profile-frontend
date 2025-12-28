/**
 * Section Config Mutation Hooks
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sectionConfigRepository } from "../services";

export function useToggleSection(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, visible }: { sectionId: string; visible: boolean }) =>
      sectionConfigRepository.toggleSection(resumeId, sectionId, visible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", resumeId] });
    },
  });
}

export function useReorderSection(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, order }: { sectionId: string; order: number }) =>
      sectionConfigRepository.reorderSection(resumeId, sectionId, order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", resumeId] });
    },
  });
}

export function useToggleItem(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { sectionId: string; itemId: string; visible: boolean }) =>
      sectionConfigRepository.toggleItem(resumeId, args.sectionId, args.itemId, args.visible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", resumeId] });
    },
  });
}

export function useReorderItem(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { sectionId: string; itemId: string; order: number }) =>
      sectionConfigRepository.reorderItem(resumeId, args.sectionId, args.itemId, args.order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", resumeId] });
    },
  });
}

export function useBatchUpdateSections(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sections: Array<{ id: string; visible?: boolean; order?: number }>) =>
      sectionConfigRepository.batchUpdate(resumeId, sections),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", resumeId] });
    },
  });
}
