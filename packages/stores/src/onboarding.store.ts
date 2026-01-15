/**
 * Onboarding Store
 * Manages onboarding state with Zustand
 */

import { create } from "zustand";
import type {
 ProfileApiClient,
 OnboardingStatus,
 OnboardingProgress,
 SubmitOnboardingDto,
} from "@profile/api-client";

// Re-export types for consumers
export type { OnboardingStatus, OnboardingProgress };

export interface OnboardingState {
 status: OnboardingStatus | null;
 progress: OnboardingProgress | null;
 isLoading: boolean;
 error: string | null;
}

export interface OnboardingActions {
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 clearError: () => void;

 // Onboarding operations
 fetchStatus: () => Promise<OnboardingStatus>;
 fetchProgress: () => Promise<OnboardingProgress>;
 saveProgress: (data: Partial<OnboardingProgress>) => Promise<void>;
 submit: (data: SubmitOnboardingDto) => Promise<void>;
 skip: () => Promise<void>;

 // Step management
 goToStep: (step: string) => void;
 completeStep: (step: string) => void;
 updateStepData: (data: Partial<OnboardingProgress>) => void;
}

export type OnboardingStore = OnboardingState & OnboardingActions;

export const createOnboardingStore = (apiClient: ProfileApiClient) =>
 create<OnboardingStore>((set, _get) => ({
  // State
  status: null,
  progress: null,
  isLoading: false,
  error: null,

  // Basic setters
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Onboarding operations
  fetchStatus: async () => {
   set({ isLoading: true, error: null });
   try {
    const status = await apiClient.onboarding.getStatus();
    set({ status, isLoading: false });
    return status;
   } catch (error) {
    const message =
     error instanceof Error
      ? error.message
      : "Failed to fetch onboarding status";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchProgress: async () => {
   set({ isLoading: true, error: null });
   try {
    const progress = await apiClient.onboarding.getProgress();
    set({ progress, isLoading: false });
    return progress;
   } catch (error) {
    const message =
     error instanceof Error
      ? error.message
      : "Failed to fetch onboarding progress";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  saveProgress: async (data) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.onboarding.saveProgress(data as OnboardingProgress);
    set({ progress: data as OnboardingProgress, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error
      ? error.message
      : "Failed to save onboarding progress";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  submit: async (data) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.onboarding.submit(data);
    set({
     status: { hasCompletedOnboarding: true },
     progress: null,
     isLoading: false,
    });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to submit onboarding";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  skip: async () => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.onboarding.skip();
    set({
     status: { hasCompletedOnboarding: true },
     progress: null,
     isLoading: false,
    });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to skip onboarding";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  // Step management (local state)
  goToStep: (step) => {
   set((state) => ({
    progress: state.progress ? { ...state.progress, currentStep: step } : null,
   }));
  },

  completeStep: (step) => {
   set((state) => {
    if (!state.progress) return state;
    const completedSteps = state.progress.completedSteps.includes(step)
     ? state.progress.completedSteps
     : [...state.progress.completedSteps, step];
    return {
     progress: {
      ...state.progress,
      completedSteps,
     },
    };
   });
  },

  updateStepData: (data) => {
   set((state) => ({
    progress: state.progress ? { ...state.progress, ...data } : null,
   }));
  },
 }));
