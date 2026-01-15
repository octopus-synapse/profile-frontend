/**
 * Analytics Store
 * Manages analytics state with Zustand
 */

import { create } from "zustand";
import type { ProfileApiClient } from "@profile/api-client";

export interface ResumeAnalytics {
 resumeId: string;
 views: number;
 downloads: number;
 shares: number;
 lastViewedAt: Date | null;
 createdAt: Date;
 updatedAt: Date;
}

export interface ShareAnalytics {
 shareId: string;
 totalViews: number;
 uniqueVisitors: number;
 downloads: number;
 topReferrers: Array<{ referer: string; count: number }>;
 viewsByDate: Array<{ date: string; count: number }>;
 lastViewedAt: Date | null;
}

export interface UserAnalyticsSummary {
 totalViews: number;
 totalDownloads: number;
 totalShares: number;
 mostViewedResume: { id: string; title: string; views: number } | null;
}

export interface AnalyticsTimeRange {
 startDate?: string | Date;
 endDate?: string | Date;
}

export interface AnalyticsState {
 resumeAnalytics: Map<string, ResumeAnalytics>;
 shareAnalytics: Map<string, ShareAnalytics>;
 userSummary: UserAnalyticsSummary | null;
 isLoading: boolean;
 error: string | null;
}

export interface AnalyticsActions {
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 clearError: () => void;

 // Fetch operations
 fetchResumeAnalytics: (resumeId: string) => Promise<ResumeAnalytics>;
 fetchShareAnalytics: (
  shareId: string,
  timeRange?: AnalyticsTimeRange
 ) => Promise<ShareAnalytics>;
 fetchUserSummary: () => Promise<UserAnalyticsSummary>;

 // Getters
 getResumeAnalytics: (resumeId: string) => ResumeAnalytics | undefined;
 getShareAnalytics: (shareId: string) => ShareAnalytics | undefined;
}

export type AnalyticsStore = AnalyticsState & AnalyticsActions;

export const createAnalyticsStore = (apiClient: ProfileApiClient) =>
 create<AnalyticsStore>((set, get) => ({
  // State
  resumeAnalytics: new Map(),
  shareAnalytics: new Map(),
  userSummary: null,
  isLoading: false,
  error: null,

  // Basic setters
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch operations
  fetchResumeAnalytics: async (resumeId) => {
   set({ isLoading: true, error: null });
   try {
    const analytics = await apiClient.analytics.getResumeAnalytics(resumeId);
    set((state) => {
     const newMap = new Map(state.resumeAnalytics);
     newMap.set(resumeId, analytics);
     return { resumeAnalytics: newMap, isLoading: false };
    });
    return analytics;
   } catch (error) {
    const message =
     error instanceof Error
      ? error.message
      : "Failed to fetch resume analytics";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchShareAnalytics: async (shareId, timeRange) => {
   set({ isLoading: true, error: null });
   try {
    const analytics = await apiClient.analytics.getShareAnalytics(
     shareId,
     timeRange
    );
    set((state) => {
     const newMap = new Map(state.shareAnalytics);
     newMap.set(shareId, analytics);
     return { shareAnalytics: newMap, isLoading: false };
    });
    return analytics;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch share analytics";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchUserSummary: async () => {
   set({ isLoading: true, error: null });
   try {
    const summary = await apiClient.analytics.getUserAnalyticsSummary();
    set({ userSummary: summary, isLoading: false });
    return summary;
   } catch (error) {
    const message =
     error instanceof Error
      ? error.message
      : "Failed to fetch user analytics summary";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  // Getters
  getResumeAnalytics: (resumeId) => get().resumeAnalytics.get(resumeId),
  getShareAnalytics: (shareId) => get().shareAnalytics.get(shareId),
 }));
