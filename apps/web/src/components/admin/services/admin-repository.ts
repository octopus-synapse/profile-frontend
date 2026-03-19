/**
 * Admin Repository
 *
 * Wired to backend SDK for admin dashboard functionality.
 */

import { apiFetch, PLATFORM_ROUTES } from '@profile/api-client';
import type { PaginatedResponse } from '@/shared/types/api-responses';
import type { AdminStats, AdminUser, RecentActivity, SystemHealth } from '../types';

export type { AdminStats, AdminUser, RecentActivity, SystemHealth };

interface PlatformStatsData {
  totalUsers: number;
  totalResumes: number;
  totalViews: number;
  activeUsersToday: number;
  activeUsersWeek: number;
  updatedAt: string;
}

interface HealthCheckData {
  status: string;
  info?: Record<string, { status: string }>;
  error?: Record<string, { status: string }>;
}

export const adminRepository = {
  async getStats(): Promise<AdminStats> {
    const stats = await apiFetch.get<PlatformStatsData>(PLATFORM_ROUTES.PLATFORM_GET_STATISTICS);
    return {
      totalUsers: stats.totalUsers,
      activeUsers: stats.activeUsersToday,
      totalResumes: stats.totalResumes,
      publicProfiles: 0, // Not tracked by platform stats yet
      newUsersToday: stats.activeUsersToday,
      newUsersThisWeek: stats.activeUsersWeek,
      newUsersThisMonth: 0, // Not tracked yet
    };
  },

  async getRecentActivity(_limit: number): Promise<RecentActivity[]> {
    // Backend doesn't have a dedicated activity feed endpoint for admin yet
    // Will be wired when analytics bounded context exposes admin activity
    return [];
  },

  async getSystemHealth(): Promise<SystemHealth> {
    const [db, redis, storage] = await Promise.allSettled([
      apiFetch.get<HealthCheckData>('/api/v1/health/database'),
      apiFetch.get<HealthCheckData>('/api/v1/health/redis'),
      apiFetch.get<HealthCheckData>('/api/v1/health/storage'),
    ]);

    const toStatus = (
      result: PromiseSettledResult<HealthCheckData>,
    ): 'healthy' | 'degraded' | 'down' => {
      if (result.status === 'rejected') return 'down';
      return result.value.status === 'ok' ? 'healthy' : 'degraded';
    };

    return {
      database: toStatus(db),
      api: toStatus(redis),
      storage: toStatus(storage),
      lastChecked: new Date().toISOString(),
    };
  },

  async getRecentUsers(limit: number): Promise<AdminUser[]> {
    const response = await apiFetch.get<PaginatedResponse<AdminUser>>(
      `/api/v1/users/manage?limit=${limit}&page=1`,
    );
    return response.data;
  },
};
