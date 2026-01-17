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
 progress: OnboardingStore["progress"];
 isLoading: boolean;
 error: string | null;

 // Computed
 isComplete: boolean;
 currentStep: string | null;
 completedSteps: string[];

 // Actions
 fetchStatus: () => Promise<void>;
 fetchProgress: () => Promise<void>;
 saveProgress: (data: Partial<NonNullable<OnboardingStore["progress"]>>) => Promise<void>;
 submit: Parameters<OnboardingStore["submit"]>[0] extends infer T ? (data: T) => Promise<void> : never;
 skip: () => Promise<void>;
 goToStep: (step: string) => void;
 completeStep: (step: string) => void;
 updateStepData: (data: Partial<NonNullable<OnboardingStore["progress"]>>) => void;
 clearError: () => void;
}

export function useOnboarding(
 options: UseOnboardingOptions
): UseOnboardingReturn {
 const { store, autoFetch = false, onComplete, onError } = options;

 const status = store.status;
 const progress = store.progress;
 const isLoading = store.isLoading;
 const error = store.error;

 // Computed values
 const isComplete = status?.hasCompletedOnboarding ?? false;
 const currentStep = progress?.currentStep ?? null;
 const completedSteps = progress?.completedSteps ?? [];

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

 const fetchProgress = useCallback(async () => {
  try {
   await store.fetchProgress();
  } catch {
   // Error handled by store
  }
 }, [store]);

 const saveProgress = useCallback(
  async (data: Partial<NonNullable<OnboardingStore["progress"]>>) => {
   try {
    await store.saveProgress(data);
   } catch {
    // Error handled by store
   }
  },
  [store]
 );

 const submit = useCallback(
  async (data: Parameters<OnboardingStore["submit"]>[0]) => {
   try {
    await store.submit(data);
   } catch {
    // Error handled by store
   }
  },
  [store]
 );

 const skip = useCallback(async () => {
  try {
   await store.skip();
  } catch {
   // Error handled by store
  }
 }, [store]);

 const goToStep = useCallback(
  (step: string) => {
   store.goToStep(step);
  },
  [store]
 );

 const completeStep = useCallback(
  (step: string) => {
   store.completeStep(step);
  },
  [store]
 );

 const updateStepData = useCallback(
  (data: Partial<NonNullable<OnboardingStore["progress"]>>) => {
   store.updateStepData(data);
  },
  [store]
 );

 const clearError = useCallback(() => {
  store.clearError();
 }, [store]);

 return {
  status,
  progress,
  isLoading,
  error,
  isComplete,
  currentStep,
  completedSteps,
  fetchStatus,
  fetchProgress,
  saveProgress,
  submit,
  skip,
  goToStep,
  completeStep,
  updateStepData,
  clearError,
 };
}
