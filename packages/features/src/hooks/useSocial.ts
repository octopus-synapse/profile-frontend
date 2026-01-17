/**
 * useSocial Hook
 * Shared social features logic for web and mobile
 */

import { useCallback, useEffect } from "react";
import type { SocialStore } from "@profile/stores";

export interface UseSocialOptions {
 store: SocialStore;
 autoFetchFeed?: boolean;
 onSuccess?: (action: string) => void;
 onError?: (error: string) => void;
}

export interface UseSocialReturn {
 // State
 activities: SocialStore["activities"];
 followers: SocialStore["followers"];
 following: SocialStore["following"];
 stats: SocialStore["stats"];
 isLoading: boolean;
 error: string | null;

 // Actions
 fetchActivityFeed: () => Promise<void>;
 fetchFollowers: (userId: string) => Promise<void>;
 fetchFollowing: (userId: string) => Promise<void>;
 fetchSocialStats: (userId: string) => Promise<void>;
 followUser: (userId: string) => Promise<void>;
 unfollowUser: (userId: string) => Promise<void>;
 clearError: () => void;
}

export function useSocial(options: UseSocialOptions): UseSocialReturn {
 const { store, autoFetchFeed = false, onSuccess, onError } = options;

 const activities = store.activities;
 const followers = store.followers;
 const following = store.following;
 const stats = store.stats;
 const isLoading = store.isLoading;
 const error = store.error;

 // Auto-fetch activity feed
 useEffect(() => {
  if (autoFetchFeed && activities.length === 0 && !isLoading) {
   store.fetchActivityFeed().catch(() => {});
  }
 }, [autoFetchFeed, activities.length, isLoading, store]);

 // Notify on error
 useEffect(() => {
  if (error && onError) {
   onError(error);
  }
 }, [error, onError]);

 const fetchActivityFeed = useCallback(async () => {
  try {
   await store.fetchActivityFeed();
   onSuccess?.("fetchActivityFeed");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const fetchFollowers = useCallback(
  async (userId: string) => {
   try {
    await store.fetchFollowers(userId);
    onSuccess?.("fetchFollowers");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const fetchFollowing = useCallback(
  async (userId: string) => {
   try {
    await store.fetchFollowing(userId);
    onSuccess?.("fetchFollowing");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const fetchSocialStats = useCallback(
  async (userId: string) => {
   try {
    await store.fetchSocialStats(userId);
    onSuccess?.("fetchSocialStats");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const followUser = useCallback(
  async (userId: string) => {
   try {
    await store.followUser(userId);
    onSuccess?.("follow");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const unfollowUser = useCallback(
  async (userId: string) => {
   try {
    await store.unfollowUser(userId);
    onSuccess?.("unfollow");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const clearError = useCallback(() => {
  store.clearError();
 }, [store]);

 return {
  activities,
  followers,
  following,
  stats,
  isLoading,
  error,
  fetchActivityFeed,
  fetchFollowers,
  fetchFollowing,
  fetchSocialStats,
  followUser,
  unfollowUser,
  clearError,
 };
}
