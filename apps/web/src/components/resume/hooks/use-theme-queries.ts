/**
 * Theme Query Hooks
 *
 * Uses @profile/api-client SDK hooks directly.
 * Returns normalized Theme[] arrays for components.
 */

import {
  usePublicThemeFindAllSystemThemes,
  usePublicThemeFindAllThemesWithPagination,
  usePublicThemeFindPopularThemes,
  usePublicThemeFindThemeById,
  useUserThemeGetAllThemesByUser,
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
  const query = usePublicThemeFindAllThemesWithPagination({
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
  const query = usePublicThemeFindThemeById(id!, {
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
  const query = usePublicThemeFindPopularThemes(
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
  const query = usePublicThemeFindAllSystemThemes({
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
  const query = useUserThemeGetAllThemesByUser({
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

// Admin/Approver queries - Not yet in SDK
export function usePendingThemes() {
  // No pending approvals endpoint in current SDK
  return {
    data: [] as Theme[],
    isLoading: false,
    error: null,
  };
}
