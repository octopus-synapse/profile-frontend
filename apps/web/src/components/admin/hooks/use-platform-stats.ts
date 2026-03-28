'use client';

/**
 * Platform Statistics Hook
 *
 * Endpoint: GET /api/v1/platform/stats
 */

import { selectEnvelopeData, usePlatformGetStatistics } from '@profile/api-client';

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
  return usePlatformGetStatistics<PlatformStats>({
    query: {
      queryKey: platformStatsKeys.stats(),
      select: selectEnvelopeData,
      staleTime: 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
    },
  });
}
