/**
 * useAnalytics Hook
 * Shared analytics features logic for web and mobile
 */

import { useCallback, useEffect } from "react";
import type { AnalyticsStore } from "@profile/stores";

export interface UseAnalyticsOptions {
 store: AnalyticsStore;
 autoFetchSummary?: boolean;
 onSuccess?: (action: string) => void;
 onError?: (error: string) => void;
}

export interface UseAnalyticsReturn {
 // State
 resumeAnalytics: AnalyticsStore["resumeAnalytics"];
 shareAnalytics: AnalyticsStore["shareAnalytics"];
 userSummary: AnalyticsStore["userSummary"];
 isLoading: boolean;
 error: string | null;

 // Actions
 fetchResumeAnalytics: (resumeId: string) => Promise<void>;
 fetchShareAnalytics: (shareId: string) => Promise<void>;
 fetchUserSummary: () => Promise<void>;
 getResumeAnalytics: AnalyticsStore["getResumeAnalytics"];
 getShareAnalytics: AnalyticsStore["getShareAnalytics"];
 clearError: () => void;
}

export function useAnalytics(options: UseAnalyticsOptions): UseAnalyticsReturn {
 const { store, autoFetchSummary = false, onSuccess, onError } = options;

 const resumeAnalytics = store.resumeAnalytics;
 const shareAnalytics = store.shareAnalytics;
 const userSummary = store.userSummary;
 const isLoading = store.isLoading;
 const error = store.error;

 // Auto-fetch user summary
 useEffect(() => {
  if (autoFetchSummary && !userSummary && !isLoading) {
   store.fetchUserSummary().catch(() => {});
  }
 }, [autoFetchSummary, userSummary, isLoading, store]);

 // Notify on error
 useEffect(() => {
  if (error && onError) {
   onError(error);
  }
 }, [error, onError]);

 const fetchResumeAnalytics = useCallback(
  async (resumeId: string) => {
   try {
    await store.fetchResumeAnalytics(resumeId);
    onSuccess?.("fetchResumeAnalytics");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const fetchShareAnalytics = useCallback(
  async (shareId: string) => {
   try {
    await store.fetchShareAnalytics(shareId);
    onSuccess?.("fetchShareAnalytics");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const fetchUserSummary = useCallback(async () => {
  try {
   await store.fetchUserSummary();
   onSuccess?.("fetchUserSummary");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const clearError = useCallback(() => {
  store.clearError();
 }, [store]);

 return {
  resumeAnalytics,
  shareAnalytics,
  userSummary,
  isLoading,
  error,
  fetchResumeAnalytics,
  fetchShareAnalytics,
  fetchUserSummary,
  getResumeAnalytics: store.getResumeAnalytics,
  getShareAnalytics: store.getShareAnalytics,
  clearError,
 };
}
