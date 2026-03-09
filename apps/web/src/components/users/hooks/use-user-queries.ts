"use client";

/**
 * User Queries
 * TanStack Query hooks for user data fetching
 */

import { useQuery } from "@tanstack/react-query";
import { userRepository } from "../services/user-repository";
import { userKeys } from "./query-keys";
import type { AdminUserFilters } from "./types";

/**
 * Get current user profile
 */
export function useMe() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => userRepository.getMe(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get current user stats
 */
export function useMyStats() {
  return useQuery({
    queryKey: userKeys.myStats(),
    queryFn: () => userRepository.getMyStats(),
    staleTime: 1 * 60 * 1000, // 1 minute
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
    staleTime: 10 * 60 * 1000, // 10 minutes
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
    staleTime: 30 * 1000, // 30 seconds
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
    queryFn: () => userRepository.adminGetUsers(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Get single user details (Admin)
 */
export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: userKeys.admin.detail(userId),
    queryFn: () => userRepository.adminGetUser(userId),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
