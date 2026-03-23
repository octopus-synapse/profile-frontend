'use client';

/**
 * Platform Statistics Hook
 *
 * Endpoint: GET /api/v1/platform/stats
 */

import { useQuery } from '@tanstack/react-query';
import { apiFetch, PLATFORM_ROUTES } from '@profile/api-client';

// ── Types ──────────────────────────────────────────────

interface PlatformStats {
  totalUsers: number;
  totalResumes: number;
  totalViews: number;
  activeUsersToday: number;
  activeUsersWeek: number;
  updatedAt: string;
}

// ── Query Keys ─────────────────────────────────────────

export const platformStatsKeys = {
  all: ['platform'] as const,
  stats: () => [...platformStatsKeys.all, 'stats'] as const,
};

// ── Query ──────────────────────────────────────────────

export function usePlatformStats() {
  return useQuery<PlatformStats>({
    queryKey: platformStatsKeys.stats(),
    queryFn: () => apiFetch.get<PlatformStats>(PLATFORM_ROUTES.PLATFORM_GET_STATISTICS),
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}
