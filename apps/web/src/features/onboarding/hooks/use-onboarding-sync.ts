"use client";

/**
 * Onboarding Sync Hook
 * Synchronizes onboarding progress between frontend store and backend
 */

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useOnboardingProgress } from "./use-onboarding-queries";
import { useSaveOnboardingProgress } from "./use-onboarding-mutations";
import { useOnboardingStore, ONBOARDING_STEPS } from "../stores";
import type { OnboardingStep } from "../stores";

export function useOnboardingSync() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.accessToken;

  const { data: backendProgress, isLoading, isError } = useOnboardingProgress();
  const saveProgress = useSaveOnboardingProgress();

  const { currentStep, hydrateFromBackend, getStateForBackend } = useOnboardingStore();

  const hasHydrated = useRef(false);
  const previousStep = useRef<OnboardingStep | null>(null);

  // Hydrate store from backend on initial load
  useEffect(() => {
    if (backendProgress && !hasHydrated.current && isAuthenticated) {
      const backendStepIndex = getStepIndex(backendProgress.currentStep as OnboardingStep);
      const localStep = useOnboardingStore.getState().currentStep;
      const localStepIndex = getStepIndex(localStep);

      // Check if backend has actual progress (not just initial empty state)
      const backendHasProgress = 
        backendProgress.currentStep !== "welcome" || 
        (backendProgress.completedSteps && backendProgress.completedSteps.length > 0) ||
        backendProgress.personalInfo ||
        backendProgress.username ||
        backendProgress.professionalProfile ||
        (backendProgress.experiences && backendProgress.experiences.length > 0) ||
        (backendProgress.education && backendProgress.education.length > 0) ||
        (backendProgress.skills && backendProgress.skills.length > 0) ||
        (backendProgress.languages && backendProgress.languages.length > 0) ||
        backendProgress.templateSelection;

      // Check if local storage has actual progress
      const localStore = useOnboardingStore.getState();
      const localHasProgress =
        localStore.currentStep !== "welcome" ||
        (localStore.completedSteps && localStore.completedSteps.length > 0) ||
        localStore.personalInfo ||
        localStore.username ||
        localStore.professionalProfile ||
        (localStore.experiences && localStore.experiences.length > 0) ||
        (localStore.education && localStore.education.length > 0) ||
        (localStore.skills && localStore.skills.length > 0) ||
        (localStore.languages && localStore.languages.length > 0) ||
        localStore.templateSelection;

      // If backend has no progress but local has progress, keep local and sync to backend
      if (!backendHasProgress && localHasProgress) {
        // Don't reset - keep local progress and let it sync to backend
        console.log("Keeping local progress, will sync to backend");
        hasHydrated.current = true;
        previousStep.current = currentStep;
        return;
      }

      // If backend has no progress and local storage also has no progress, ensure clean state
      if (!backendHasProgress && !localHasProgress) {
        // Both are at initial state, ensure completedSteps is empty
        if (localStore.completedSteps.length > 0) {
          // Reset to clean initial state
          useOnboardingStore.setState({
            currentStep: "welcome",
            completedSteps: [],
            personalInfo: null,
            username: backendProgress.username || null, // Preserve username if exists
            professionalProfile: null,
            experiences: [],
            noExperience: false,
            education: [],
            noEducation: false,
            skills: [],
            noSkills: false,
            languages: [],
            templateSelection: null,
          });
        }
      }

      // Use backend progress if it has actual data or is further along
      if (backendHasProgress && (backendStepIndex > localStepIndex || !localHasProgress)) {
        hydrateFromBackend({
          currentStep: backendProgress.currentStep as OnboardingStep,
          completedSteps: (backendProgress.completedSteps || []) as OnboardingStep[],
          personalInfo: backendProgress.personalInfo,
          username: backendProgress.username || null,
          professionalProfile: backendProgress.professionalProfile,
          experiences: backendProgress.experiences || [],
          noExperience: backendProgress.noExperience || false,
          education: backendProgress.education || [],
          noEducation: backendProgress.noEducation || false,
          skills: backendProgress.skills || [],
          noSkills: backendProgress.noSkills || false,
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
    if (
      isAuthenticated &&
      hasHydrated.current &&
      previousStep.current !== null &&
      previousStep.current !== currentStep
    ) {
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

// Helper to get step index - use the same list as ONBOARDING_STEPS
function getStepIndex(step: OnboardingStep): number {
  return ONBOARDING_STEPS.findIndex((s) => s.id === step);
}
