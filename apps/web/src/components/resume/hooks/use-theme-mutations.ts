/**
 * Theme Mutation Hooks
 *
 * Uses @profile/api-client SDK hooks directly.
 */

import {
  useUserThemeApply,
  useUserThemeCreateThemeForUser,
  useUserThemeDeleteThemeForUser,
  useUserThemeFork,
  useUserThemeUpdateThemeForUser,
} from '@profile/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { themeKeys } from './theme-query-keys';

// Note: The current SDK has incomplete theme API - create/update/fork/apply have no body params
// These hooks wrap the SDK mutations with proper invalidation

export function useCreateTheme() {
  const queryClient = useQueryClient();
  const mutation = useUserThemeCreateThemeForUser();

  return {
    ...mutation,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutateAsync: async (_input: any) => {
      // SDK create has no body param - backend spec incomplete
      const result = await mutation.mutateAsync();
      void queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
      return result;
    },
  };
}

export function useUpdateTheme() {
  const queryClient = useQueryClient();
  const mutation = useUserThemeUpdateThemeForUser();

  return {
    ...mutation,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutateAsync: async ({ id, input: _input }: { id: string; input: any }) => {
      // SDK update only takes id - backend spec incomplete for body
      const result = await mutation.mutateAsync({ id });
      void queryClient.invalidateQueries({ queryKey: themeKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
      return result;
    },
  };
}

export function useDeleteTheme() {
  const queryClient = useQueryClient();
  const mutation = useUserThemeDeleteThemeForUser();

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
  const mutation = useUserThemeFork();

  return {
    ...mutation,
    mutateAsync: async ({ themeId: _themeId, name: _name }: { themeId: string; name: string }) => {
      // SDK fork has no params - backend spec incomplete
      const result = await mutation.mutateAsync();
      void queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
      return result;
    },
  };
}

export function useApplyTheme() {
  const queryClient = useQueryClient();
  const mutation = useUserThemeApply();

  return {
    ...mutation,
    mutateAsync: async ({
      resumeId,
      themeId: _themeId,
      customizations: _customizations,
    }: {
      resumeId: string;
      themeId: string;
      customizations?: Record<string, unknown>;
    }) => {
      // SDK apply has no params - backend spec incomplete
      const result = await mutation.mutateAsync();
      void queryClient.invalidateQueries({ queryKey: ['resumes', resumeId] });
      return result;
    },
  };
}

// Approval workflow hooks - Not yet in SDK
export function useSubmitForApproval() {
  const queryClient = useQueryClient();

  return {
    mutate: () => {
      throw new Error('submitForApproval not available in SDK');
    },
    mutateAsync: async (_themeId: string) => {
      throw new Error('submitForApproval not available in SDK');
    },
    isPending: false,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: themeKeys.mine() });
    },
  };
}

export function useApproveTheme() {
  const queryClient = useQueryClient();

  return {
    mutate: () => {
      throw new Error('approveTheme not available in SDK');
    },
    mutateAsync: async (_themeId: string) => {
      throw new Error('approveTheme not available in SDK');
    },
    isPending: false,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: themeKeys.pending() });
      void queryClient.invalidateQueries({ queryKey: themeKeys.all });
    },
  };
}

export function useRejectTheme() {
  const queryClient = useQueryClient();

  return {
    mutate: () => {
      throw new Error('rejectTheme not available in SDK');
    },
    mutateAsync: async (_params: { themeId: string; reason: string }) => {
      throw new Error('rejectTheme not available in SDK');
    },
    isPending: false,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: themeKeys.pending() });
    },
  };
}
