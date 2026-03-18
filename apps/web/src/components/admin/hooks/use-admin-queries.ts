'use client';

/**
 * Admin Queries
 */

import { useQuery } from '@tanstack/react-query';
import { adminRepository } from '../services/admin-repository';
import { adminKeys } from './query-keys';

/**
 * Get admin dashboard stats
 */
export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => adminRepository.getStats(),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Get recent activity
 */
export function useRecentActivity(limit = 10) {
  return useQuery({
    queryKey: adminKeys.activity(limit),
    queryFn: () => adminRepository.getRecentActivity(limit),
    staleTime: 30 * 1000,
  });
}

/**
 * Get system health
 */
export function useSystemHealth() {
  return useQuery({
    queryKey: adminKeys.health(),
    queryFn: () => adminRepository.getSystemHealth(),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Auto-refresh every minute
  });
}

/**
 * Get recent users
 */
export function useRecentUsers(limit = 5) {
  return useQuery({
    queryKey: adminKeys.recentUsers(limit),
    queryFn: () => adminRepository.getRecentUsers(limit),
    staleTime: 30 * 1000,
  });
}
