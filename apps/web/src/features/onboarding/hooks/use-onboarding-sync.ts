"use client";

/**
 * Onboarding Sync Hook
 * Synchronizes onboarding progress between frontend store and backend
 */

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useOnboardingProgress } from "./use-onboarding-queries";
import { useSaveOnboardingProgress } from "./use-onboarding-mutations";
import { useOnboardingStore } from "../stores";
import type { OnboardingStep } from "../stores";

export function useOnboardingSync() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.accessToken;

  const { data: backendProgress, isLoading, isError } = useOnboardingProgress();
  const saveProgress = useSaveOnboardingProgress();

  const {
    currentStep,
    hydrateFromBackend,
    getStateForBackend,
  } = useOnboardingStore();

  const hasHydrated = useRef(false);
  const previousStep = useRef<OnboardingStep | null>(null);

  // Hydrate store from backend on initial load
  useEffect(() => {
    if (backendProgress && !hasHydrated.current && isAuthenticated) {
      // Only hydrate if backend has progress beyond welcome
      // This allows local storage to work for offline scenarios
      const backendStepIndex = getStepIndex(backendProgress.currentStep as OnboardingStep);
      const localStep = useOnboardingStore.getState().currentStep;
      const localStepIndex = getStepIndex(localStep);

      // Use backend progress if it's further along
      if (backendStepIndex > localStepIndex) {
        hydrateFromBackend({
          currentStep: backendProgress.currentStep as OnboardingStep,
          completedSteps: backendProgress.completedSteps as OnboardingStep[],
          personalInfo: backendProgress.personalInfo,
          professionalProfile: backendProgress.professionalProfile,
          experiences: backendProgress.experiences || [],
          noExperience: backendProgress.noExperience,
          education: backendProgress.education || [],
          noEducation: backendProgress.noEducation,
          skills: backendProgress.skills || [],
          noSkills: backendProgress.noSkills,
          languages: backendProgress.languages || [],
          templateSelection: backendProgress.templateSelection,
        });
      }

      hasHydrated.current = true;
      previousStep.current = currentStep;
    }
  }, [backendProgress, hydrateFromBackend, currentStep, isAuthenticated]);

  // Save progress to backend when step changes (only if authenticated)
  useEffect(() => {
    if (isAuthenticated && hasHydrated.current && previousStep.current !== null && previousStep.current !== currentStep) {
      const state = getStateForBackend();
      saveProgress.mutate(state);
    }
    previousStep.current = currentStep;
  }, [currentStep, getStateForBackend, saveProgress, isAuthenticated]);

  // Manual save function for explicit saves
  const saveToBackend = useCallback(() => {
    if (!isAuthenticated) {
      return Promise.resolve({ success: false, currentStep: "", completedSteps: [] });
    }
    const state = getStateForBackend();
    return saveProgress.mutateAsync(state);
  }, [getStateForBackend, saveProgress, isAuthenticated]);

  return {
    isLoading: status === "loading" || (isAuthenticated && isLoading),
    isError,
    isSaving: saveProgress.isPending,
    saveToBackend,
    isAuthenticated,
  };
}

// Helper to get step index
function getStepIndex(step: OnboardingStep): number {
  const steps: OnboardingStep[] = [
    "welcome",
    "personal-info",
    "professional-profile",
    "experience",
    "education",
    "skills",
    "languages",
    "template",
    "review",
    "complete",
  ];
  return steps.indexOf(step);
}
