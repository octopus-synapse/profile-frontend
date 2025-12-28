/**
 * Admin Repository
 * Handles admin-related API calls
 */

import type { HttpClient } from "../client";
import type { AdminStats, AdminUser, RecentActivity, SystemHealth } from "../types";

const BASE_URL = "/admin";

export function createAdminRepository(client: HttpClient) {
  return {
    /**
     * Get admin dashboard stats
     */
    async getStats(): Promise<AdminStats> {
      return client.get<AdminStats>(`${BASE_URL}/stats`);
    },

    /**
     * Get recent activity
     */
    async getRecentActivity(limit = 10): Promise<RecentActivity[]> {
      return client.get<RecentActivity[]>(`${BASE_URL}/activity?limit=${limit}`);
    },

    /**
     * Get system health status
     */
    async getSystemHealth(): Promise<SystemHealth> {
      return client.get<SystemHealth>(`${BASE_URL}/health`);
    },

    /**
     * Get recent users
     */
    async getRecentUsers(limit = 5): Promise<AdminUser[]> {
      return client.get<AdminUser[]>(`${BASE_URL}/users/recent?limit=${limit}`);
    },
  };
}

export type AdminRepository = ReturnType<typeof createAdminRepository>;
