'use client';

/**
 * User Queries
 * TanStack Query hooks for user data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { CACHE_TIMES } from '@/shared/constants/cache-times';
import { userRepository } from '../services/user-repository';
import type { AdminUserFilters } from '../types';
import { userKeys } from './query-keys';

/**
 * Get current user profile
 */
export function useMe() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => userRepository.getMe(),
    staleTime: CACHE_TIMES.MEDIUM,
  });
}

/**
 * Get current user stats
 */
export function useMyStats() {
  return useQuery({
    queryKey: userKeys.myStats(),
    queryFn: () => userRepository.getMyStats(),
    staleTime: 60_000,
  });
}

/**
 * Get public profile by username
 */
export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: userKeys.profile(username),
    queryFn: () => userRepository.getByUsername(username),
    enabled: !!username,
    staleTime: CACHE_TIMES.LONG,
  });
}

/**
 * Check username availability
 */
export function useCheckUsername(username: string) {
  return useQuery({
    queryKey: userKeys.checkUsername(username),
    queryFn: () => userRepository.checkUsername(username),
    enabled: !!username && username.length >= 3,
    staleTime: CACHE_TIMES.SHORT, // 30 seconds
  });
}

// ============================================================================
// Admin Queries
// ============================================================================

/**
 * Get paginated users list (Admin)
 */
export function useAdminUsers(filters?: AdminUserFilters) {
  return useQuery({
    queryKey: userKeys.admin.list(filters as Record<string, unknown> | undefined),
    queryFn: () => userRepository.getUsers(filters),
    staleTime: CACHE_TIMES.SHORT,
  });
}

/**
 * Get single user details (Admin)
 */
export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: userKeys.admin.detail(userId),
    queryFn: () => userRepository.getUserById(userId),
    enabled: !!userId,
    staleTime: 60_000,
  });
}
