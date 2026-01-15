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
 dashboardStats: AdminStore["dashboardStats"];
 recentActivity: AdminStore["recentActivity"];
 systemHealth: AdminStore["systemHealth"];
 users: AdminStore["users"];
 isLoading: boolean;
 error: string | null;

 // Actions
 fetchDashboardStats: () => Promise<void>;
 fetchRecentActivity: () => Promise<void>;
 fetchSystemHealth: () => Promise<void>;
 fetchUsers: (page?: number, limit?: number) => Promise<void>;
 updateUserRole: (userId: string, role: string) => Promise<void>;
 suspendUser: (userId: string) => Promise<void>;
 unsuspendUser: (userId: string) => Promise<void>;
 clearError: () => void;
}

export function useAdmin(options: UseAdminOptions): UseAdminReturn {
 const { store, autoFetchDashboard = false, onSuccess, onError } = options;

 const dashboardStats = store.dashboardStats;
 const recentActivity = store.recentActivity;
 const systemHealth = store.systemHealth;
 const users = store.users;
 const isLoading = store.isLoading;
 const error = store.error;

 // Auto-fetch dashboard stats
 useEffect(() => {
  if (autoFetchDashboard && !dashboardStats && !isLoading) {
   store.fetchDashboardStats().catch(() => {});
  }
 }, [autoFetchDashboard, dashboardStats, isLoading, store]);

 // Notify on error
 useEffect(() => {
  if (error && onError) {
   onError(error);
  }
 }, [error, onError]);

 const fetchDashboardStats = useCallback(async () => {
  try {
   await store.fetchDashboardStats();
   onSuccess?.("fetchDashboardStats");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const fetchRecentActivity = useCallback(async () => {
  try {
   await store.fetchRecentActivity();
   onSuccess?.("fetchRecentActivity");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const fetchSystemHealth = useCallback(async () => {
  try {
   await store.fetchSystemHealth();
   onSuccess?.("fetchSystemHealth");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const fetchUsers = useCallback(
  async (page?: number, limit?: number) => {
   try {
    await store.fetchUsers(page, limit);
    onSuccess?.("fetchUsers");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const updateUserRole = useCallback(
  async (userId: string, role: string) => {
   try {
    await store.updateUserRole(userId, role);
    onSuccess?.("updateUserRole");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const suspendUser = useCallback(
  async (userId: string) => {
   try {
    await store.suspendUser(userId);
    onSuccess?.("suspendUser");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const unsuspendUser = useCallback(
  async (userId: string) => {
   try {
    await store.unsuspendUser(userId);
    onSuccess?.("unsuspendUser");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const clearError = useCallback(() => {
  store.clearError();
 }, [store]);

 return {
  dashboardStats,
  recentActivity,
  systemHealth,
  users,
  isLoading,
  error,
  fetchDashboardStats,
  fetchRecentActivity,
  fetchSystemHealth,
  fetchUsers,
  updateUserRole,
  suspendUser,
  unsuspendUser,
  clearError,
 };
}
