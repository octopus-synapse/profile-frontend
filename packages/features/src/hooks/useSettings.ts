/**
 * useSettings Hook
 * Shared user settings logic for web and mobile
 */

import { useCallback, useEffect } from "react";
import type { SettingsStore, UserSettings } from "@profile/stores";

export interface UseSettingsOptions {
 store: SettingsStore;
 autoFetch?: boolean;
 onSuccess?: (action: string) => void;
 onError?: (error: string) => void;
}

export interface UseSettingsReturn {
 // State
 settings: SettingsStore["settings"];
 dataExport: SettingsStore["dataExport"];
 isLoading: boolean;
 isExporting: boolean;
 isDeleting: boolean;
 error: string | null;

 // Actions
 fetchSettings: () => Promise<void>;
 updateSettings: (data: Partial<UserSettings>) => Promise<void>;
 exportUserData: () => Promise<void>;
 deleteAccount: () => Promise<void>;
 clearError: () => void;
}

export function useSettings(options: UseSettingsOptions): UseSettingsReturn {
 const { store, autoFetch = false, onSuccess, onError } = options;

 const settings = store.settings;
 const dataExport = store.dataExport;
 const isLoading = store.isLoading;
 const isExporting = store.isExporting;
 const isDeleting = store.isDeleting;
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
  async (data: Partial<UserSettings>) => {
   try {
    await store.updateSettings(data);
    onSuccess?.("updateSettings");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const exportUserData = useCallback(async () => {
  try {
   await store.exportUserData();
   onSuccess?.("exportUserData");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const deleteAccount = useCallback(async () => {
  try {
   await store.deleteAccount();
   onSuccess?.("deleteAccount");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const clearError = useCallback(() => {
  store.clearError();
 }, [store]);

 return {
  settings,
  dataExport,
  isLoading,
  isExporting,
  isDeleting,
  error,
  fetchSettings,
  updateSettings,
  exportUserData,
  deleteAccount,
  clearError,
 };
}
