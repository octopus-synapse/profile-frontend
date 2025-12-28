/**
 * Theme Query Hooks
 */

import { useQuery } from "@tanstack/react-query";
import { themeRepository } from "../services";
import { themeKeys } from "./theme-query-keys";
import type { ThemeQueryParams } from "../services";

export function useThemes(params?: ThemeQueryParams) {
  return useQuery({
    queryKey: themeKeys.list((params ?? {}) as Record<string, unknown>),
    queryFn: () => themeRepository.getAll(params),
  });
}

export function useTheme(id: string | undefined) {
  return useQuery({
    queryKey: themeKeys.detail(id!),
    queryFn: () => themeRepository.getById(id!),
    enabled: !!id,
  });
}

export function usePopularThemes(limit = 10) {
  return useQuery({
    queryKey: themeKeys.popular(limit),
    queryFn: () => themeRepository.getPopular(limit),
  });
}

export function useSystemThemes() {
  return useQuery({
    queryKey: themeKeys.system(),
    queryFn: () => themeRepository.getSystem(),
  });
}

export function useMyThemes() {
  return useQuery({
    queryKey: themeKeys.mine(),
    queryFn: () => themeRepository.getMyThemes(),
  });
}

// Admin/Approver queries
export function usePendingThemes() {
  return useQuery({
    queryKey: themeKeys.pending(),
    queryFn: () => themeRepository.getPendingApprovals(),
  });
}
