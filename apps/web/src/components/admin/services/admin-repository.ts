/**
 * Admin Repository
 *
 * Stub implementations for admin dashboard functionality.
 * TODO: Replace with actual SDK calls when backend implements admin endpoints.
 */

import type { AdminStats, AdminUser, RecentActivity, SystemHealth } from '../types';

// Re-export types for backward compatibility
export type { AdminStats, AdminUser, RecentActivity, SystemHealth };

/**
 * Admin repository with stub implementations
 * Returns placeholder data until backend admin API is implemented
 */
export const adminRepository = {
  /**
   * Get admin dashboard statistics
   * @stub Returns placeholder stats
   */
  getStats: async (): Promise<AdminStats> => {
    console.warn('[STUB] adminRepository.getStats: Backend not implemented');
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalResumes: 0,
      publicProfiles: 0,
      newUsersToday: 0,
      newUsersThisWeek: 0,
      newUsersThisMonth: 0,
    };
  },

  /**
   * Get recent activity
   * @stub Returns empty array
   */
  getRecentActivity: async (_limit: number): Promise<RecentActivity[]> => {
    console.warn('[STUB] adminRepository.getRecentActivity: Backend not implemented');
    return [];
  },

  /**
   * Get system health status
   * @stub Returns all healthy
   */
  getSystemHealth: async (): Promise<SystemHealth> => {
    console.warn('[STUB] adminRepository.getSystemHealth: Backend not implemented');
    return {
      database: 'healthy',
      api: 'healthy',
      storage: 'healthy',
      lastChecked: new Date().toISOString(),
    };
  },

  /**
   * Get recent users
   * @stub Returns empty array
   */
  getRecentUsers: async (_limit: number): Promise<AdminUser[]> => {
    console.warn('[STUB] adminRepository.getRecentUsers: Backend not implemented');
    return [];
  },
};
