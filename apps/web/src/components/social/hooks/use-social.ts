'use client';

import { apiFetch } from '@profile/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CACHE_TIMES } from '@/shared/constants/cache-times';

// ============================================================================
// Types
// ============================================================================

export interface SocialUser {
  id: string;
  name: string | null;
  username: string | null;
  photoURL: string | null;
  bio: string | null;
}

export interface SocialStats {
  followersCount: number;
  followingCount: number;
  resumeCount: number;
}

export interface Activity {
  id: string;
  type: string;
  actorId: string;
  actorName: string;
  actorPhotoURL: string | null;
  description: string;
  targetId: string | null;
  createdAt: string;
}

interface PaginatedUsers {
  users: SocialUser[];
  total: number;
  page: number;
  limit: number;
}

interface PaginatedActivities {
  activities: Activity[];
  total: number;
  page: number;
  limit: number;
}

// ============================================================================
// Query Key Factory
// ============================================================================

export const socialKeys = {
  all: ['social'] as const,
  followers: (userId: string) => [...socialKeys.all, 'followers', userId] as const,
  following: (userId: string) => [...socialKeys.all, 'following', userId] as const,
  isFollowing: (userId: string) => [...socialKeys.all, 'isFollowing', userId] as const,
  stats: (userId: string) => [...socialKeys.all, 'stats', userId] as const,
  feed: () => [...socialKeys.all, 'feed'] as const,
  activities: (userId: string) => [...socialKeys.all, 'activities', userId] as const,
};

// ============================================================================
// Queries
// ============================================================================

export function useFollowers(userId: string) {
  return useQuery({
    queryKey: socialKeys.followers(userId),
    queryFn: () => apiFetch.get<PaginatedUsers>(`/api/v1/users/${userId}/followers`),
    staleTime: CACHE_TIMES.SHORT,
    enabled: !!userId,
  });
}

export function useFollowing(userId: string) {
  return useQuery({
    queryKey: socialKeys.following(userId),
    queryFn: () => apiFetch.get<PaginatedUsers>(`/api/v1/users/${userId}/following`),
    staleTime: CACHE_TIMES.SHORT,
    enabled: !!userId,
  });
}

export function useIsFollowing(userId: string) {
  return useQuery({
    queryKey: socialKeys.isFollowing(userId),
    queryFn: () => apiFetch.get<{ isFollowing: boolean }>(`/api/v1/users/${userId}/is-following`),
    staleTime: CACHE_TIMES.REALTIME,
    enabled: !!userId,
  });
}

export function useSocialStats(userId: string) {
  return useQuery({
    queryKey: socialKeys.stats(userId),
    queryFn: () => apiFetch.get<SocialStats>(`/api/v1/users/${userId}/social-stats`),
    staleTime: CACHE_TIMES.SHORT,
    enabled: !!userId,
  });
}

export function useActivityFeed() {
  return useQuery({
    queryKey: socialKeys.feed(),
    queryFn: () => apiFetch.get<PaginatedActivities>('/api/v1/users/me/feed'),
    staleTime: 60_000,
  });
}

// ============================================================================
// Mutations
// ============================================================================

export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => apiFetch.post<void>(`/api/v1/users/${userId}/follow`, {}),
    onSuccess: (_data, userId) => {
      void queryClient.invalidateQueries({
        queryKey: socialKeys.isFollowing(userId),
      });
      void queryClient.invalidateQueries({
        queryKey: socialKeys.stats(userId),
      });
      void queryClient.invalidateQueries({
        queryKey: socialKeys.followers(userId),
      });
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => apiFetch.delete<void>(`/api/v1/users/${userId}/follow`),
    onSuccess: (_data, userId) => {
      void queryClient.invalidateQueries({
        queryKey: socialKeys.isFollowing(userId),
      });
      void queryClient.invalidateQueries({
        queryKey: socialKeys.stats(userId),
      });
      void queryClient.invalidateQueries({
        queryKey: socialKeys.followers(userId),
      });
    },
  });
}
