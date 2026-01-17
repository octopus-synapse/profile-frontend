/**
 * useTwoFactor Hook
 * Shared two-factor authentication logic for web and mobile
 */

import { useCallback, useEffect } from "react";
import type { TwoFactorStore } from "@profile/stores";

export interface UseTwoFactorOptions {
 store: TwoFactorStore;
 autoFetchStatus?: boolean;
 onSuccess?: (action: string) => void;
 onError?: (error: string) => void;
}

export interface UseTwoFactorReturn {
 // State
 status: TwoFactorStore["status"];
 setup: TwoFactorStore["setup"];
 backupCodes: string[];
 isLoading: boolean;
 error: string | null;

 // Actions
 fetchStatus: () => Promise<void>;
 startSetup: () => Promise<void>;
 verifySetup: (token: string) => Promise<string[]>;
 verifyLogin: (token: string) => Promise<boolean>;
 disable: (token: string) => Promise<void>;
 regenerateBackupCodes: (token: string) => Promise<string[]>;
 clearSetup: () => void;
 clearError: () => void;
}

export function useTwoFactor(options: UseTwoFactorOptions): UseTwoFactorReturn {
 const { store, autoFetchStatus = false, onSuccess, onError } = options;

 const status = store.status;
 const setup = store.setup;
 const backupCodes = store.backupCodes;
 const isLoading = store.isLoading;
 const error = store.error;

 // Auto-fetch 2FA status
 useEffect(() => {
  if (autoFetchStatus && !status && !isLoading) {
   store.fetchStatus().catch(() => {});
  }
 }, [autoFetchStatus, status, isLoading, store]);

 // Notify on error
 useEffect(() => {
  if (error && onError) {
   onError(error);
  }
 }, [error, onError]);

 const fetchStatus = useCallback(async () => {
  try {
   await store.fetchStatus();
   onSuccess?.("fetchStatus");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const startSetup = useCallback(async () => {
  try {
   await store.startSetup();
   onSuccess?.("startSetup");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const verifySetup = useCallback(
  async (token: string): Promise<string[]> => {
   try {
    const codes = await store.verifySetup(token);
    onSuccess?.("verifySetup");
    return codes;
   } catch {
    return [];
   }
  },
  [store, onSuccess]
 );

 const verifyLogin = useCallback(
  async (token: string): Promise<boolean> => {
   try {
    const result = await store.verifyLogin(token);
    if (result) {
     onSuccess?.("verifyLogin");
    }
    return result;
   } catch {
    return false;
   }
  },
  [store, onSuccess]
 );

 const disable = useCallback(
  async (token: string): Promise<void> => {
   try {
    await store.disable(token);
    onSuccess?.("disable");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const regenerateBackupCodes = useCallback(
  async (token: string): Promise<string[]> => {
   try {
    const codes = await store.regenerateBackupCodes(token);
    onSuccess?.("regenerateBackupCodes");
    return codes;
   } catch {
    return [];
   }
  },
  [store, onSuccess]
 );

 const clearSetup = useCallback(() => {
  store.clearSetup();
 }, [store]);

 const clearError = useCallback(() => {
  store.clearError();
 }, [store]);

 return {
  status,
  setup,
  backupCodes,
  isLoading,
  error,
  fetchStatus,
  startSetup,
  verifySetup,
  verifyLogin,
  disable,
  regenerateBackupCodes,
  clearSetup,
  clearError,
 };
}
