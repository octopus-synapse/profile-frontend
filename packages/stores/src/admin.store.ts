/**
 * Admin Store
 * Manages admin dashboard state with Zustand
 */

import { create } from "zustand";
import type {
 ProfileApiClient,
 AdminStats,
 AdminUser,
 RecentActivity,
 SystemHealth,
} from "@profile/api-client";

// Re-export types for consumers
export type { AdminStats, AdminUser, RecentActivity, SystemHealth };

export interface AdminState {
 stats: AdminStats | null;
 recentActivity: RecentActivity[];
 systemHealth: SystemHealth | null;
 recentUsers: AdminUser[];
 isLoading: boolean;
 error: string | null;
}

export interface AdminActions {
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 clearError: () => void;

 // Admin operations
 fetchStats: () => Promise<AdminStats>;
 fetchRecentActivity: (limit?: number) => Promise<RecentActivity[]>;
 fetchSystemHealth: () => Promise<SystemHealth>;
 fetchRecentUsers: (limit?: number) => Promise<AdminUser[]>;
 fetchDashboardData: () => Promise<void>;
}

export type AdminStore = AdminState & AdminActions;

export const createAdminStore = (apiClient: ProfileApiClient) =>
 create<AdminStore>((set) => ({
  // State
  stats: null,
  recentActivity: [],
  systemHealth: null,
  recentUsers: [],
  isLoading: false,
  error: null,

  // Basic setters
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Admin operations
  fetchStats: async () => {
   set({ isLoading: true, error: null });
   try {
    const stats = await apiClient.admin.getStats();
    set({ stats, isLoading: false });
    return stats;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch admin stats";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchRecentActivity: async (limit = 10) => {
   set({ isLoading: true, error: null });
   try {
    const recentActivity = await apiClient.admin.getRecentActivity(limit);
    set({ recentActivity, isLoading: false });
    return recentActivity;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch recent activity";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchSystemHealth: async () => {
   set({ isLoading: true, error: null });
   try {
    const systemHealth = await apiClient.admin.getSystemHealth();
    set({ systemHealth, isLoading: false });
    return systemHealth;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch system health";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchRecentUsers: async (limit = 5) => {
   set({ isLoading: true, error: null });
   try {
    const recentUsers = await apiClient.admin.getRecentUsers(limit);
    set({ recentUsers, isLoading: false });
    return recentUsers;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch recent users";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchDashboardData: async () => {
   set({ isLoading: true, error: null });
   try {
    const [stats, recentActivity, systemHealth, recentUsers] =
     await Promise.all([
      apiClient.admin.getStats(),
      apiClient.admin.getRecentActivity(10),
      apiClient.admin.getSystemHealth(),
      apiClient.admin.getRecentUsers(5),
     ]);
    set({
     stats,
     recentActivity,
     systemHealth,
     recentUsers,
     isLoading: false,
    });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch dashboard data";
    set({ error: message, isLoading: false });
    throw error;
   }
  },
 }));
