/**
 * Social Store
 * Manages social features (follow/unfollow, activity feed)
 */

import { create } from "zustand";
import type { ProfileApiClient } from "@profile/api-client";
import type { Activity, FollowUser, SocialStats } from "@profile/api-client";

export interface SocialState {
 followers: FollowUser[];
 following: FollowUser[];
 activities: Activity[];
 stats: SocialStats | null;
 isLoading: boolean;
 error: string | null;
}

export interface SocialActions {
 setFollowers: (followers: FollowUser[]) => void;
 setFollowing: (following: FollowUser[]) => void;
 setActivities: (activities: Activity[]) => void;
 setStats: (stats: SocialStats | null) => void;
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 followUser: (userId: string) => Promise<void>;
 unfollowUser: (userId: string) => Promise<void>;
 fetchFollowers: (userId: string) => Promise<void>;
 fetchFollowing: (userId: string) => Promise<void>;
 fetchActivityFeed: () => Promise<void>;
 fetchSocialStats: (userId: string) => Promise<void>;
 clearError: () => void;
}

export type SocialStore = SocialState & SocialActions;

export const createSocialStore = (apiClient: ProfileApiClient) =>
 create<SocialStore>((set, get) => ({
  // State
  followers: [],
  following: [],
  activities: [],
  stats: null,
  isLoading: false,
  error: null,

  // Actions
  setFollowers: (followers) => set({ followers }),

  setFollowing: (following) => set({ following }),

  setActivities: (activities) => set({ activities }),

  setStats: (stats) => set({ stats }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  followUser: async (userId) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.social.follow(userId);
    // Optionally update stats
    const { stats } = get();
    if (stats) {
     set({
      stats: { ...stats, followingCount: stats.followingCount + 1 },
      isLoading: false,
     });
    }
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to follow user";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  unfollowUser: async (userId) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.social.unfollow(userId);
    // Optionally update stats
    const { stats } = get();
    if (stats) {
     set({
      stats: { ...stats, followingCount: stats.followingCount - 1 },
      isLoading: false,
     });
    }
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to unfollow user";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchFollowers: async (userId) => {
   set({ isLoading: true, error: null });
   try {
    const result = await apiClient.social.getFollowers(userId);
    set({ followers: result.data, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch followers";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchFollowing: async (userId) => {
   set({ isLoading: true, error: null });
   try {
    const result = await apiClient.social.getFollowing(userId);
    set({ following: result.data, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch following";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchActivityFeed: async () => {
   set({ isLoading: true, error: null });
   try {
    const result = await apiClient.social.getActivityFeed();
    set({ activities: result.data, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch activity feed";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchSocialStats: async (userId) => {
   set({ isLoading: true, error: null });
   try {
    const stats = await apiClient.social.getSocialStats(userId);
    set({ stats, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch social stats";
    set({ error: message, isLoading: false });
    throw error;
   }
  },
 }));
