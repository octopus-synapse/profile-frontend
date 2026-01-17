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
    const user = await apiClient.users.getMe();
    const prefs = (user as { preferences?: Partial<UserSettings> }).preferences;
    const settings: UserSettings = {
     emailNotifications: prefs?.emailNotifications ?? true,
     marketingEmails: prefs?.marketingEmails ?? false,
     twoFactorEnabled: prefs?.twoFactorEnabled ?? false,
     language: prefs?.language ?? "en",
     timezone:
      prefs?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
     theme: prefs?.theme ?? "system",
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
    // Note: preferences are not in UpdateUserDto type but API accepts it
    await apiClient.users.updateMe({
     preferences: newSettings,
    } as Parameters<typeof apiClient.users.updateMe>[0] & {
     preferences?: Partial<UserSettings>;
    });
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
