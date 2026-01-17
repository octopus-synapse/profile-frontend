/**
 * useAdmin Hook
 * Shared admin panel logic for web and mobile
 */

import { useCallback, useEffect } from "react";
import type { AdminStore } from "@profile/stores";

export interface UseAdminOptions {
 store: AdminStore;
 autoFetchDashboard?: boolean;
 onSuccess?: (action: string) => void;
 onError?: (error: string) => void;
}

export interface UseAdminReturn {
 // State
 stats: AdminStore["stats"];
 recentActivity: AdminStore["recentActivity"];
 systemHealth: AdminStore["systemHealth"];
 recentUsers: AdminStore["recentUsers"];
 isLoading: boolean;
 error: string | null;

 // Actions
 fetchStats: () => Promise<void>;
 fetchRecentActivity: (limit?: number) => Promise<void>;
 fetchSystemHealth: () => Promise<void>;
 fetchRecentUsers: (limit?: number) => Promise<void>;
 fetchDashboardData: () => Promise<void>;
 clearError: () => void;
}

export function useAdmin(options: UseAdminOptions): UseAdminReturn {
 const { store, autoFetchDashboard = false, onSuccess, onError } = options;

 const stats = store.stats;
 const recentActivity = store.recentActivity;
 const systemHealth = store.systemHealth;
 const recentUsers = store.recentUsers;
 const isLoading = store.isLoading;
 const error = store.error;

 // Auto-fetch dashboard data
 useEffect(() => {
  if (autoFetchDashboard && !stats && !isLoading) {
   store.fetchDashboardData().catch(() => {});
  }
 }, [autoFetchDashboard, stats, isLoading, store]);

 // Notify on error
 useEffect(() => {
  if (error && onError) {
   onError(error);
  }
 }, [error, onError]);

 const fetchStats = useCallback(async () => {
  try {
   await store.fetchStats();
   onSuccess?.("fetchStats");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const fetchRecentActivity = useCallback(
  async (limit?: number) => {
   try {
    await store.fetchRecentActivity(limit);
    onSuccess?.("fetchRecentActivity");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const fetchSystemHealth = useCallback(async () => {
  try {
   await store.fetchSystemHealth();
   onSuccess?.("fetchSystemHealth");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const fetchRecentUsers = useCallback(
  async (limit?: number) => {
   try {
    await store.fetchRecentUsers(limit);
    onSuccess?.("fetchRecentUsers");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const fetchDashboardData = useCallback(async () => {
  try {
   await store.fetchDashboardData();
   onSuccess?.("fetchDashboardData");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const clearError = useCallback(() => {
  store.clearError();
 }, [store]);

 return {
  stats,
  recentActivity,
  systemHealth,
  recentUsers,
  isLoading,
  error,
  fetchStats,
  fetchRecentActivity,
  fetchSystemHealth,
  fetchRecentUsers,
  fetchDashboardData,
  clearError,
 };
}
