/**
 * Theme Mutation Hooks
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { themeRepository } from "../services";
import { themeKeys } from "./theme-query-keys";
import type { CreateThemeInput, UpdateThemeInput } from "../services";

export function useCreateTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateThemeInput) => themeRepository.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
    },
  });
}

export function useUpdateTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateThemeInput }) =>
      themeRepository.update(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: themeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
    },
  });
}

export function useDeleteTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => themeRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
    },
  });
}

export function useForkTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ themeId, name }: { themeId: string; name: string }) =>
      themeRepository.fork(themeId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
    },
  });
}

export function useApplyTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      themeId,
      customizations,
    }: {
      resumeId: string;
      themeId: string;
      customizations?: Record<string, unknown>;
    }) => themeRepository.apply(resumeId, themeId, customizations),
    onSuccess: (_, { resumeId }) => {
      queryClient.invalidateQueries({ queryKey: ["resumes", resumeId] });
    },
  });
}

// Approval workflow hooks
export function useSubmitForApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (themeId: string) => themeRepository.submitForApproval(themeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
    },
  });
}

export function useApproveTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (themeId: string) => themeRepository.approveTheme(themeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: themeKeys.pending() });
      queryClient.invalidateQueries({ queryKey: themeKeys.all });
    },
  });
}

export function useRejectTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ themeId, reason }: { themeId: string; reason: string }) =>
      themeRepository.rejectTheme(themeId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: themeKeys.pending() });
    },
  });
}
