/**
 * Two-Factor Authentication Store
 * Manages 2FA state with Zustand
 */

import { create } from "zustand";
import type { ProfileApiClient } from "@profile/api-client";

export interface TwoFactorSetup {
 secret: string;
 qrCodeUrl: string;
 backupCodes: string[];
}

export interface TwoFactorStatus {
 enabled: boolean;
 verifiedAt: Date | null;
}

export interface TwoFactorState {
 status: TwoFactorStatus | null;
 setup: TwoFactorSetup | null;
 backupCodes: string[];
 isLoading: boolean;
 error: string | null;
}

export interface TwoFactorActions {
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 clearError: () => void;
 clearSetup: () => void;

 // 2FA operations
 fetchStatus: () => Promise<TwoFactorStatus>;
 startSetup: () => Promise<TwoFactorSetup>;
 verifySetup: (token: string) => Promise<string[]>;
 verifyLogin: (token: string) => Promise<boolean>;
 disable: (token: string) => Promise<void>;
 regenerateBackupCodes: (token: string) => Promise<string[]>;
}

export type TwoFactorStore = TwoFactorState & TwoFactorActions;

export const createTwoFactorStore = (apiClient: ProfileApiClient) =>
 create<TwoFactorStore>((set, _get) => ({
  // State
  status: null,
  setup: null,
  backupCodes: [],
  isLoading: false,
  error: null,

  // Basic setters
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  clearSetup: () => set({ setup: null }),

  // 2FA operations
  fetchStatus: async () => {
   set({ isLoading: true, error: null });
   try {
    const status = await apiClient.twoFactor.getStatus();
    set({ status, isLoading: false });
    return status;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch 2FA status";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  startSetup: async () => {
   set({ isLoading: true, error: null });
   try {
    const setup = await apiClient.twoFactor.setup();
    set({ setup, isLoading: false });
    return setup;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to start 2FA setup";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  verifySetup: async (token) => {
   set({ isLoading: true, error: null });
   try {
    const result = await apiClient.twoFactor.verifySetup({ token });
    set({
     backupCodes: result.backupCodes,
     status: { enabled: true, verifiedAt: new Date() },
     setup: null,
     isLoading: false,
    });
    return result.backupCodes;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to verify 2FA setup";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  verifyLogin: async (token) => {
   set({ isLoading: true, error: null });
   try {
    const result = await apiClient.twoFactor.verifyLogin({ token });
    set({ isLoading: false });
    return result.success;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to verify 2FA token";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  disable: async (token) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.twoFactor.disable(token);
    set({
     status: { enabled: false, verifiedAt: null },
     backupCodes: [],
     isLoading: false,
    });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to disable 2FA";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  regenerateBackupCodes: async (token) => {
   set({ isLoading: true, error: null });
   try {
    const result = await apiClient.twoFactor.regenerateBackupCodes(token);
    set({ backupCodes: result.backupCodes, isLoading: false });
    return result.backupCodes;
   } catch (error) {
    const message =
     error instanceof Error
      ? error.message
      : "Failed to regenerate backup codes";
    set({ error: message, isLoading: false });
    throw error;
   }
  },
 }));
