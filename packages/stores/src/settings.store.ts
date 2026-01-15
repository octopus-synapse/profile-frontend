/**
 * Settings Store
 * Manages user settings and GDPR operations with Zustand
 */

import { create } from "zustand";
import type { ProfileApiClient } from "@profile/api-client";

export interface UserSettings {
 emailNotifications: boolean;
 marketingEmails: boolean;
 twoFactorEnabled: boolean;
 language: string;
 timezone: string;
 theme: "light" | "dark" | "system";
}

export interface UserDataExport {
 exportedAt: string;
 dataRetentionPolicy: string;
 user: Record<string, unknown>;
 consents: Array<Record<string, unknown>>;
 resumes: Array<Record<string, unknown>>;
 auditLogs: Array<Record<string, unknown>>;
}

export interface SettingsState {
 settings: UserSettings | null;
 dataExport: UserDataExport | null;
 isLoading: boolean;
 isExporting: boolean;
 isDeleting: boolean;
 error: string | null;
}

export interface SettingsActions {
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 clearError: () => void;

 // Settings operations
 fetchSettings: () => Promise<UserSettings>;
 updateSettings: (settings: Partial<UserSettings>) => Promise<void>;

 // GDPR operations
 exportUserData: () => Promise<UserDataExport>;
 deleteAccount: () => Promise<void>;
}

export type SettingsStore = SettingsState & SettingsActions;

export const createSettingsStore = (apiClient: ProfileApiClient) =>
 create<SettingsStore>((set) => ({
  // State
  settings: null,
  dataExport: null,
  isLoading: false,
  isExporting: false,
  isDeleting: false,
  error: null,

  // Basic setters
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Settings operations
  fetchSettings: async () => {
   set({ isLoading: true, error: null });
   try {
    // Settings are fetched from dedicated endpoint or defaults
    // User profile doesn't have preferences, so we use defaults
    const settings: UserSettings = {
     emailNotifications: true,
     marketingEmails: false,
     twoFactorEnabled: false,
     language: "en",
     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
     theme: "system",
    };
    set({ settings, isLoading: false });
    return settings;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch settings";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  updateSettings: async (newSettings) => {
   set({ isLoading: true, error: null });
   try {
    // Settings updates could be done via dedicated settings endpoint
    // For now, just update local state
    set((state) => ({
     settings: state.settings ? { ...state.settings, ...newSettings } : null,
     isLoading: false,
    }));
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to update settings";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  // GDPR operations
  exportUserData: async () => {
   set({ isExporting: true, error: null });
   try {
    const dataExport = await apiClient.gdpr.exportData();
    set({ dataExport, isExporting: false });
    return dataExport;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to export user data";
    set({ error: message, isExporting: false });
    throw error;
   }
  },

  deleteAccount: async () => {
   set({ isDeleting: true, error: null });
   try {
    await apiClient.gdpr.deleteAccount();
    set({ isDeleting: false });
    // Caller should handle logout/redirect
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to delete account";
    set({ error: message, isDeleting: false });
    throw error;
   }
  },
 }));
