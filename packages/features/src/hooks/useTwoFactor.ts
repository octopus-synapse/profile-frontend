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
 isEnabled: boolean;
 setupData: TwoFactorStore["setupData"];
 backupCodes: string[];
 isLoading: boolean;
 error: string | null;

 // Actions
 fetchStatus: () => Promise<void>;
 setup: () => Promise<void>;
 verify: (code: string) => Promise<boolean>;
 disable: (code: string) => Promise<boolean>;
 generateBackupCodes: () => Promise<void>;
 verifyBackupCode: (code: string) => Promise<boolean>;
 clearSetupData: () => void;
 clearError: () => void;
}

export function useTwoFactor(options: UseTwoFactorOptions): UseTwoFactorReturn {
 const { store, autoFetchStatus = false, onSuccess, onError } = options;

 const isEnabled = store.isEnabled;
 const setupData = store.setupData;
 const backupCodes = store.backupCodes;
 const isLoading = store.isLoading;
 const error = store.error;

 // Auto-fetch 2FA status
 useEffect(() => {
  if (autoFetchStatus && !isLoading) {
   store.fetchStatus().catch(() => {});
  }
 }, [autoFetchStatus, isLoading, store]);

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

 const setup = useCallback(async () => {
  try {
   await store.setup();
   onSuccess?.("setup");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const verify = useCallback(
  async (code: string): Promise<boolean> => {
   try {
    const result = await store.verify(code);
    if (result) {
     onSuccess?.("verify");
    }
    return result;
   } catch {
    return false;
   }
  },
  [store, onSuccess]
 );

 const disable = useCallback(
  async (code: string): Promise<boolean> => {
   try {
    const result = await store.disable(code);
    if (result) {
     onSuccess?.("disable");
    }
    return result;
   } catch {
    return false;
   }
  },
  [store, onSuccess]
 );

 const generateBackupCodes = useCallback(async () => {
  try {
   await store.generateBackupCodes();
   onSuccess?.("generateBackupCodes");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const verifyBackupCode = useCallback(
  async (code: string): Promise<boolean> => {
   try {
    const result = await store.verifyBackupCode(code);
    if (result) {
     onSuccess?.("verifyBackupCode");
    }
    return result;
   } catch {
    return false;
   }
  },
  [store, onSuccess]
 );

 const clearSetupData = useCallback(() => {
  store.clearSetupData();
 }, [store]);

 const clearError = useCallback(() => {
  store.clearError();
 }, [store]);

 return {
  isEnabled,
  setupData,
  backupCodes,
  isLoading,
  error,
  fetchStatus,
  setup,
  verify,
  disable,
  generateBackupCodes,
  verifyBackupCode,
  clearSetupData,
  clearError,
 };
}
