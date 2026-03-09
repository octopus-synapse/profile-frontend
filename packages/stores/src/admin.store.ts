import { create } from "zustand";
import type {
 UserProfileResponseDto,
 PlatformStatsResponseDto,
} from "@profile/api-client";

/**
 * Admin Store
 *
 * Uses SDK-generated types from @profile/api-client.
 * Types are auto-generated from backend OpenAPI spec.
 */

export interface AdminStoreState {
 stats: PlatformStatsResponseDto | null;
 users: UserProfileResponseDto[];
 isLoading: boolean;
 error: string | null;
}

export interface AdminStoreActions {
 setStats: (stats: PlatformStatsResponseDto) => void;
 setUsers: (users: UserProfileResponseDto[]) => void;
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 clearError: () => void;
 reset: () => void;
}

export type AdminStore = AdminStoreState & AdminStoreActions;

export const createAdminStore = () =>
 create<AdminStore>((set) => ({
  stats: null,
  users: [],
  isLoading: false,
  error: null,

  setStats: (stats) => set({ stats }),
  setUsers: (users) => set({ users }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set({ stats: null, users: [], isLoading: false, error: null }),
 }));
