/**
 * Theme Query Hooks
 *
 * Uses @profile/api-client SDK hooks directly.
 * Returns normalized Theme[] arrays for components.
 */

import {
  useThemesFindAllSystemThemes,
  useThemesFindAllThemesWithPagination,
  useThemesFindPopularThemes,
  useThemesFindThemeById,
  useThemesGetAllThemesByUser,
  useThemesGetPending,
} from '@profile/api-client';
import { useMemo } from 'react';
import type { Theme } from '../services/theme.types';
import { themeKeys } from './theme-query-keys';

interface ThemeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Helper to extract themes array from SDK response
function extractThemes(data: unknown): Theme[] {
  if (!data) return [];
  // SDK structure: { data: { data: { themes: Theme[] } } } or { data: { themes: Theme[] } }
  const nested = data as {
    data?: { data?: { themes?: Theme[] }; themes?: Theme[] };
  };
  return nested?.data?.data?.themes ?? nested?.data?.themes ?? [];
}

export function useThemes(_params?: ThemeQueryParams) {
  // SDK pagination is handled via request options, not query params
  const query = useThemesFindAllThemesWithPagination({
    query: {
      queryKey: themeKeys.list({}),
    },
  });

  const themes = useMemo(() => extractThemes(query.data), [query.data]);

  return {
    ...query,
    data: themes,
  };
}

export function useTheme(id: string | undefined) {
  const query = useThemesFindThemeById(id!, {
    query: {
      queryKey: themeKeys.detail(id!),
      enabled: !!id,
    },
  });

  const theme = useMemo(() => {
    if (!query.data) return null;
    const nested = query.data as unknown as {
      data?: { data?: { theme?: Theme }; theme?: Theme };
    };
    return nested?.data?.data?.theme ?? nested?.data?.theme ?? null;
  }, [query.data]);

  return {
    ...query,
    data: theme,
  };
}

export function usePopularThemes(limit = 10) {
  const query = useThemesFindPopularThemes(
    { limit },
    {
      query: {
        queryKey: themeKeys.popular(limit),
      },
    },
  );

  const themes = useMemo(() => extractThemes(query.data), [query.data]);

  return {
    ...query,
    data: themes,
  };
}

export function useSystemThemes() {
  const query = useThemesFindAllSystemThemes({
    query: {
      queryKey: themeKeys.system(),
    },
  });

  const themes = useMemo(() => extractThemes(query.data), [query.data]);

  return {
    ...query,
    data: themes,
  };
}

export function useMyThemes() {
  const query = useThemesGetAllThemesByUser({
    query: {
      queryKey: themeKeys.mine(),
    },
  });

  const themes = useMemo(() => extractThemes(query.data), [query.data]);

  return {
    ...query,
    data: themes,
  };
}

// Admin/Approver queries — wired to SDK
export function usePendingThemes() {
  const query = useThemesGetPending();
  const themes: Theme[] = ((query.data?.data as unknown as { themes?: Theme[] })?.themes ?? []);

  return {
    data: themes,
    isLoading: query.isLoading,
    error: query.error,
  };
}
