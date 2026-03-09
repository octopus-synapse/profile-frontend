import { create } from "zustand";
import type { UserProfileResponseDto } from "@profile/api-client";

export interface SettingsStoreState {
 settings: UserProfileResponseDto | null;
 isLoading: boolean;
 error: string | null;
}

export interface SettingsStoreActions {
 setSettings: (settings: UserProfileResponseDto) => void;
 setLoading: (isLoading: boolean) => void;
 setError: (error: string | null) => void;
 clearError: () => void;
}

export type SettingsStore = SettingsStoreState & SettingsStoreActions;

export const createSettingsStore = () =>
 create<SettingsStore>((set) => ({
  settings: null,
  isLoading: false,
  error: null,

  setSettings: (settings: UserProfileResponseDto) => set({ settings }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
 }));
