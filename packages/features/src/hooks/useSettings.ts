/**
 * useSettings Hook
 * Shared user settings logic for web and mobile
 */

import { useCallback, useEffect } from "react";
import type { SettingsStore } from "@profile/stores";

export interface UseSettingsOptions {
 store: SettingsStore;
 autoFetch?: boolean;
 onSuccess?: (action: string) => void;
 onError?: (error: string) => void;
}

export interface UseSettingsReturn {
 // State
 settings: SettingsStore["settings"];
 isLoading: boolean;
 error: string | null;

 // Actions
 fetchSettings: () => Promise<void>;
 updateSettings: (data: Partial<SettingsStore["settings"]>) => Promise<void>;
 requestGdprExport: () => Promise<void>;
 requestAccountDeletion: () => Promise<void>;
 clearError: () => void;
}

export function useSettings(options: UseSettingsOptions): UseSettingsReturn {
 const { store, autoFetch = false, onSuccess, onError } = options;

 const settings = store.settings;
 const isLoading = store.isLoading;
 const error = store.error;

 // Auto-fetch settings
 useEffect(() => {
  if (autoFetch && !settings && !isLoading) {
   store.fetchSettings().catch(() => {});
  }
 }, [autoFetch, settings, isLoading, store]);

 // Notify on error
 useEffect(() => {
  if (error && onError) {
   onError(error);
  }
 }, [error, onError]);

 const fetchSettings = useCallback(async () => {
  try {
   await store.fetchSettings();
   onSuccess?.("fetchSettings");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const updateSettings = useCallback(
  async (data: Partial<SettingsStore["settings"]>) => {
   try {
    await store.updateSettings(data);
    onSuccess?.("updateSettings");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const requestGdprExport = useCallback(async () => {
  try {
   await store.requestGdprExport();
   onSuccess?.("requestGdprExport");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const requestAccountDeletion = useCallback(async () => {
  try {
   await store.requestAccountDeletion();
   onSuccess?.("requestAccountDeletion");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const clearError = useCallback(() => {
  store.clearError();
 }, [store]);

 return {
  settings,
  isLoading,
  error,
  fetchSettings,
  updateSettings,
  requestGdprExport,
  requestAccountDeletion,
  clearError,
 };
}
