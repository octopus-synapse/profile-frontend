/**
 * Admin Repository
 * API calls for admin functionality
 */

import { httpClient } from "@/shared/lib/http-client";
import type { AdminStats, AdminUser, RecentActivity, SystemHealth } from "../types";

const BASE_URL = "/admin";

export const adminRepository = {
  /**
   * Get admin dashboard stats
   */
  async getStats(): Promise<AdminStats> {
    return httpClient.get<AdminStats>(`${BASE_URL}/stats`);
  },

  /**
   * Get recent activity
   */
  async getRecentActivity(limit = 10): Promise<RecentActivity[]> {
    return httpClient.get<RecentActivity[]>(`${BASE_URL}/activity?limit=${limit}`);
  },

  /**
   * Get system health status
   */
  async getSystemHealth(): Promise<SystemHealth> {
    return httpClient.get<SystemHealth>(`${BASE_URL}/health`);
  },

  /**
   * Get recent users
   */
  async getRecentUsers(limit = 5): Promise<AdminUser[]> {
    return httpClient.get<AdminUser[]>(`${BASE_URL}/users/recent?limit=${limit}`);
  },
};
