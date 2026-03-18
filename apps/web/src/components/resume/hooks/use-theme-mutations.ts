/**
 * Theme Mutation Hooks
 *
 * Uses @profile/api-client SDK hooks directly.
 */

import {
  useThemesApply,
  useThemesCreateThemeForUser,
  useThemesDeleteThemeForUser,
  useThemesFork,
  useThemesReview,
  useThemesSubmit,
  useThemesUpdateThemeForUser,
} from '@profile/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { themeKeys } from './theme-query-keys';

function serializeStyleConfig(styleConfig: unknown): string | undefined {
  if (styleConfig == null) return undefined;
  return typeof styleConfig === 'string' ? styleConfig : JSON.stringify(styleConfig);
}

export function useCreateTheme() {
  const queryClient = useQueryClient();
  const mutation = useThemesCreateThemeForUser();

  return {
    ...mutation,
    mutateAsync: async ({
      name,
      category,
      styleConfig,
      description,
      tags,
      parentThemeId,
    }: {
      name: string;
      category: string;
      styleConfig: unknown;
      description?: string;
      tags?: string[];
      parentThemeId?: string;
    }) => {
      const result = await mutation.mutateAsync({
        data: {
          name,
          category,
          description: description ?? '',
          tags,
          parentThemeId,
          styleConfig: serializeStyleConfig(styleConfig) ?? '{}',
        },
      });
      void queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
      return result;
    },
  };
}

export function useUpdateTheme() {
  const queryClient = useQueryClient();
  const mutation = useThemesUpdateThemeForUser();

  return {
    ...mutation,
    mutateAsync: async ({
      id,
      input,
    }: {
      id: string;
      input: {
        name?: string;
        description?: string;
        category?: string;
        tags?: string[];
        styleConfig?: unknown;
      };
    }) => {
      const result = await mutation.mutateAsync({
        id,
        data: {
          name: input.name ?? '',
          description: input.description ?? '',
          category: input.category,
          tags: input.tags,
          styleConfig: serializeStyleConfig(input.styleConfig),
        },
      });
      void queryClient.invalidateQueries({ queryKey: themeKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
      return result;
    },
  };
}

export function useDeleteTheme() {
  const queryClient = useQueryClient();
  const mutation = useThemesDeleteThemeForUser();

  return {
    ...mutation,
    mutateAsync: async (id: string) => {
      const result = await mutation.mutateAsync({ id });
      void queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
      return result;
    },
  };
}

export function useForkTheme() {
  const queryClient = useQueryClient();
  const mutation = useThemesFork();

  return {
    ...mutation,
    mutateAsync: async ({
      themeId,
      name,
      description,
    }: {
      themeId: string;
      name: string;
      description?: string;
    }) => {
      const result = await mutation.mutateAsync({
        data: {
          themeId,
          name,
          description: description ?? '',
        },
      });
      void queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
      return result;
    },
  };
}

export function useApplyTheme() {
  const queryClient = useQueryClient();
  const mutation = useThemesApply();

  return {
    ...mutation,
    mutateAsync: async ({
      resumeId,
      themeId,
      customizations,
    }: {
      resumeId: string;
      themeId: string;
      customizations?: Record<string, unknown>;
    }) => {
      const result = await mutation.mutateAsync({
        data: {
          resumeId,
          themeId,
          customizations: customizations ? JSON.stringify(customizations) : undefined,
        },
      });
      void queryClient.invalidateQueries({ queryKey: ['resumes', 'detail', resumeId] });
      void queryClient.invalidateQueries({ queryKey: ['resumes', resumeId] });
      return result;
    },
  };
}

// Approval workflow hooks - Not yet in SDK
export function useSubmitForApproval() {
  const queryClient = useQueryClient();
  const mutation = useThemesSubmit();

  return {
    ...mutation,
    mutateAsync: async (themeId: string, message?: string) => {
      const result = await mutation.mutateAsync({
        id: themeId,
        data: { message },
      });
      void queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
      return result;
    },
  };
}

export function useApproveTheme() {
  const queryClient = useQueryClient();
  const mutation = useThemesReview();

  return {
    ...mutation,
    mutateAsync: async (themeId: string) => {
      const result = await mutation.mutateAsync({
        data: {
          themeId,
          approved: true,
          feedback: '',
          rejectionReason: '',
        },
      });
      void queryClient.invalidateQueries({ queryKey: themeKeys.pending() });
      void queryClient.invalidateQueries({ queryKey: themeKeys.all });
      return result;
    },
  };
}

export function useRejectTheme() {
  const queryClient = useQueryClient();
  const mutation = useThemesReview();

  return {
    ...mutation,
    mutateAsync: async ({ themeId, reason }: { themeId: string; reason: string }) => {
      const result = await mutation.mutateAsync({
        data: {
          themeId,
          approved: false,
          feedback: '',
          rejectionReason: reason,
        },
      });
      void queryClient.invalidateQueries({ queryKey: themeKeys.pending() });
      return result;
    },
  };
}
