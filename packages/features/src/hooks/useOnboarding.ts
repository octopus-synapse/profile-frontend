/**
 * useOnboarding Hook
 * Shared onboarding logic for web and mobile
 */

import { useCallback, useEffect } from "react";
import type { OnboardingStore } from "@profile/stores";

export interface UseOnboardingOptions {
 store: OnboardingStore;
 autoFetch?: boolean;
 onComplete?: () => void;
 onError?: (error: string) => void;
}

export interface UseOnboardingReturn {
 // State
 status: OnboardingStore["status"];
 currentStep: number;
 totalSteps: number;
 progress: number;
 isComplete: boolean;
 isLoading: boolean;
 error: string | null;

 // Actions
 fetchStatus: () => Promise<void>;
 completeStep: (step: string) => Promise<void>;
 skipStep: (step: string) => Promise<void>;
 resetOnboarding: () => Promise<void>;
 clearError: () => void;
}

export function useOnboarding(
 options: UseOnboardingOptions
): UseOnboardingReturn {
 const { store, autoFetch = false, onComplete, onError } = options;

 const status = store.status;
 const currentStep = store.currentStep;
 const totalSteps = store.totalSteps;
 const progress = store.progress;
 const isComplete = store.isComplete;
 const isLoading = store.isLoading;
 const error = store.error;

 // Auto-fetch onboarding status
 useEffect(() => {
  if (autoFetch && !status && !isLoading) {
   store.fetchStatus().catch(() => {});
  }
 }, [autoFetch, status, isLoading, store]);

 // Notify on completion
 useEffect(() => {
  if (isComplete && onComplete) {
   onComplete();
  }
 }, [isComplete, onComplete]);

 // Notify on error
 useEffect(() => {
  if (error && onError) {
   onError(error);
  }
 }, [error, onError]);

 const fetchStatus = useCallback(async () => {
  try {
   await store.fetchStatus();
  } catch {
   // Error handled by store
  }
 }, [store]);

 const completeStep = useCallback(
  async (step: string) => {
   try {
    await store.completeStep(step);
   } catch {
    // Error handled by store
   }
  },
  [store]
 );

 const skipStep = useCallback(
  async (step: string) => {
   try {
    await store.skipStep(step);
   } catch {
    // Error handled by store
   }
  },
  [store]
 );

 const resetOnboarding = useCallback(async () => {
  try {
   await store.resetOnboarding();
  } catch {
   // Error handled by store
  }
 }, [store]);

 const clearError = useCallback(() => {
  store.clearError();
 }, [store]);

 return {
  status,
  currentStep,
  totalSteps,
  progress,
  isComplete,
  isLoading,
  error,
  fetchStatus,
  completeStep,
  skipStep,
  resetOnboarding,
  clearError,
 };
}
