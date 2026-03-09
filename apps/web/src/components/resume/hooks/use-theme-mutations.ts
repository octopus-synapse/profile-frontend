/**
 * Theme Mutation Hooks
 *
 * Uses @profile/api-client for all API calls.
 * This ensures web and mobile share the same implementation.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { themeKeys } from "./theme-query-keys";
import type { CreateThemeDto, UpdateThemeDto } from "@profile/api-client";

export function useCreateTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateThemeDto) => apiClient.themes.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
    },
  });
}

export function useUpdateTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateThemeDto }) =>
      apiClient.themes.update(id, input),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: themeKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
    },
  });
}

export function useDeleteTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.themes.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
    },
  });
}

export function useForkTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ themeId, name }: { themeId: string; name: string }) =>
      apiClient.themes.fork(themeId, name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
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
    }) => apiClient.themes.apply({ resumeId, themeId, customizations }),
    onSuccess: (_, { resumeId }) => {
      void queryClient.invalidateQueries({ queryKey: ["resumes", resumeId] });
    },
  });
}

// Approval workflow hooks
export function useSubmitForApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (themeId: string) => apiClient.themes.submitForApproval(themeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
    },
  });
}

export function useApproveTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (themeId: string) => apiClient.themes.approve(themeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: themeKeys.pending() });
      void queryClient.invalidateQueries({ queryKey: themeKeys.all });
    },
  });
}

export function useRejectTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ themeId, reason }: { themeId: string; reason: string }) =>
      apiClient.themes.reject(themeId, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: themeKeys.pending() });
    },
  });
}
