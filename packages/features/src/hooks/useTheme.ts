/**
 * useTheme Hook
 * Shared theme management logic for web and mobile
 */

import { useCallback, useEffect } from "react";
import type {
 CreateTheme,
 UpdateTheme,
 QueryThemes,
} from "@octopus-synapse/profile-contracts";
import type { ThemeStore, Theme } from "@profile/stores";

export interface UseThemeOptions {
 store: ThemeStore;
 autoFetchSystem?: boolean;
 autoFetchPopular?: boolean;
 onSuccess?: (action: string) => void;
 onError?: (error: string) => void;
}

export interface UseThemeReturn {
 // State
 themes: Theme[];
 myThemes: Theme[];
 systemThemes: Theme[];
 popularThemes: Theme[];
 currentTheme: Theme | null;
 isLoading: boolean;
 error: string | null;

 // Actions
 fetchThemes: (params?: QueryThemes) => Promise<void>;
 fetchMyThemes: () => Promise<void>;
 fetchSystemThemes: () => Promise<void>;
 fetchPopularThemes: (limit?: number) => Promise<void>;
 createTheme: (data: CreateTheme) => Promise<Theme>;
 updateTheme: (id: string, data: UpdateTheme) => Promise<void>;
 deleteTheme: (id: string) => Promise<void>;
 forkTheme: (themeId: string, name: string) => Promise<Theme>;
 applyToResume: (resumeId: string, themeId: string) => Promise<void>;
 selectTheme: (theme: Theme | null) => void;
 clearError: () => void;
}

export function useTheme(options: UseThemeOptions): UseThemeReturn {
 const {
  store,
  autoFetchSystem = false,
  autoFetchPopular = false,
  onSuccess,
  onError,
 } = options;

 const themes = store.themes;
 const myThemes = store.myThemes;
 const systemThemes = store.systemThemes;
 const popularThemes = store.popularThemes;
 const currentTheme = store.currentTheme;
 const isLoading = store.isLoading;
 const error = store.error;

 // Auto-fetch system themes
 useEffect(() => {
  if (autoFetchSystem && systemThemes.length === 0 && !isLoading) {
   store.fetchSystemThemes().catch(() => {});
  }
 }, [autoFetchSystem, systemThemes.length, isLoading, store]);

 // Auto-fetch popular themes
 useEffect(() => {
  if (autoFetchPopular && popularThemes.length === 0 && !isLoading) {
   store.fetchPopularThemes().catch(() => {});
  }
 }, [autoFetchPopular, popularThemes.length, isLoading, store]);

 // Notify on error
 useEffect(() => {
  if (error && onError) {
   onError(error);
  }
 }, [error, onError]);

 const fetchThemes = useCallback(
  async (params?: QueryThemes) => {
   try {
    await store.fetchThemes(params);
    onSuccess?.("fetch");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const fetchMyThemes = useCallback(async () => {
  try {
   await store.fetchMyThemes();
   onSuccess?.("fetch");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const fetchSystemThemes = useCallback(async () => {
  try {
   await store.fetchSystemThemes();
   onSuccess?.("fetch");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const fetchPopularThemes = useCallback(
  async (limit?: number) => {
   try {
    await store.fetchPopularThemes(limit);
    onSuccess?.("fetch");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const createTheme = useCallback(
  async (data: CreateTheme) => {
   const theme = await store.createTheme(data);
   onSuccess?.("create");
   return theme;
  },
  [store, onSuccess]
 );

 const updateTheme = useCallback(
  async (id: string, data: UpdateTheme) => {
   try {
    await store.updateTheme(id, data);
    onSuccess?.("update");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const deleteTheme = useCallback(
  async (id: string) => {
   try {
    await store.deleteTheme(id);
    onSuccess?.("delete");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const forkTheme = useCallback(
  async (themeId: string, name: string) => {
   const theme = await store.forkTheme(themeId, name);
   onSuccess?.("fork");
   return theme;
  },
  [store, onSuccess]
 );

 const applyToResume = useCallback(
  async (resumeId: string, themeId: string) => {
   try {
    await store.applyToResume(resumeId, themeId);
    onSuccess?.("apply");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const selectTheme = useCallback(
  (theme: Theme | null) => {
   store.setCurrentTheme(theme);
  },
  [store]
 );

 const clearError = useCallback(() => {
  store.clearError();
 }, [store]);

 return {
  themes,
  myThemes,
  systemThemes,
  popularThemes,
  currentTheme,
  isLoading,
  error,
  fetchThemes,
  fetchMyThemes,
  fetchSystemThemes,
  fetchPopularThemes,
  createTheme,
  updateTheme,
  deleteTheme,
  forkTheme,
  applyToResume,
  selectTheme,
  clearError,
 };
}
