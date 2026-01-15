/**
 * useSocial Hook
 * Shared social features logic for web and mobile
 */

import { useCallback, useEffect } from "react";
import type { SocialStore } from "@profile/stores";

export interface UserProfile {
 id: string;
 username: string;
 fullName: string | null;
 avatar: string | null;
 bio: string | null;
 isFollowing: boolean;
 followerCount: number;
 followingCount: number;
}

export interface ActivityItem {
 id: string;
 userId: string;
 username: string;
 avatar: string | null;
 action: string;
 targetType: string;
 targetId: string;
 targetTitle: string;
 createdAt: string;
}

export interface UseSocialOptions {
 store: SocialStore;
 autoFetchFeed?: boolean;
 onSuccess?: (action: string) => void;
 onError?: (error: string) => void;
}

export interface UseSocialReturn {
 // State
 feed: ActivityItem[];
 followers: UserProfile[];
 following: UserProfile[];
 searchResults: UserProfile[];
 isLoading: boolean;
 error: string | null;

 // Actions
 fetchFeed: () => Promise<void>;
 fetchFollowers: (userId?: string) => Promise<void>;
 fetchFollowing: (userId?: string) => Promise<void>;
 followUser: (userId: string) => Promise<void>;
 unfollowUser: (userId: string) => Promise<void>;
 searchUsers: (query: string) => Promise<void>;
 clearSearch: () => void;
 clearError: () => void;
}

export function useSocial(options: UseSocialOptions): UseSocialReturn {
 const { store, autoFetchFeed = false, onSuccess, onError } = options;

 const feed = store.feed;
 const followers = store.followers;
 const following = store.following;
 const searchResults = store.searchResults;
 const isLoading = store.isLoading;
 const error = store.error;

 // Auto-fetch feed
 useEffect(() => {
  if (autoFetchFeed && feed.length === 0 && !isLoading) {
   store.fetchFeed().catch(() => {});
  }
 }, [autoFetchFeed, feed.length, isLoading, store]);

 // Notify on error
 useEffect(() => {
  if (error && onError) {
   onError(error);
  }
 }, [error, onError]);

 const fetchFeed = useCallback(async () => {
  try {
   await store.fetchFeed();
   onSuccess?.("fetchFeed");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const fetchFollowers = useCallback(
  async (userId?: string) => {
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
  async (userId?: string) => {
   try {
    await store.fetchFollowing(userId);
    onSuccess?.("fetchFollowing");
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

 const searchUsers = useCallback(
  async (query: string) => {
   try {
    await store.searchUsers(query);
    onSuccess?.("search");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const clearSearch = useCallback(() => {
  store.clearSearch();
 }, [store]);

 const clearError = useCallback(() => {
  store.clearError();
 }, [store]);

 return {
  feed,
  followers,
  following,
  searchResults,
  isLoading,
  error,
  fetchFeed,
  fetchFollowers,
  fetchFollowing,
  followUser,
  unfollowUser,
  searchUsers,
  clearSearch,
  clearError,
 };
}
