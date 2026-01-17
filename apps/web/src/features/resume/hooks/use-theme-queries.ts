/**
 * Theme Query Hooks
 *
 * Uses @profile/api-client for all API calls.
 * This ensures web and mobile share the same implementation.
 */

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { themeKeys } from "./theme-query-keys";
import type { ThemeQueryParams } from "@profile/api-client";

export function useThemes(params?: ThemeQueryParams) {
  return useQuery({
    queryKey: themeKeys.list((params ?? {}) as Record<string, unknown>),
    queryFn: () => apiClient.themes.getAll(params),
  });
}

export function useTheme(id: string | undefined) {
  return useQuery({
    queryKey: themeKeys.detail(id!),
    queryFn: () => apiClient.themes.getById(id!),
    enabled: !!id,
  });
}

export function usePopularThemes(limit = 10) {
  return useQuery({
    queryKey: themeKeys.popular(limit),
    queryFn: () => apiClient.themes.getPopular(limit),
  });
}

export function useSystemThemes() {
  return useQuery({
    queryKey: themeKeys.system(),
    queryFn: () => apiClient.themes.getSystem(),
  });
}

export function useMyThemes() {
  return useQuery({
    queryKey: themeKeys.mine(),
    queryFn: () => apiClient.themes.getMyThemes(),
  });
}

// Admin/Approver queries
export function usePendingThemes() {
  return useQuery({
    queryKey: themeKeys.pending(),
    queryFn: () => apiClient.themes.getPendingApprovals(),
  });
}
