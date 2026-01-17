"use client";

/**
 * Onboarding Sync Hook
 * Synchronizes onboarding progress between frontend store and backend
 */

import { useEffect, useRef, useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { useOnboardingProgress } from "./use-onboarding-queries";
import { useSaveOnboardingProgress } from "./use-onboarding-mutations";
import { useOnboardingStore, ONBOARDING_STEPS } from "../stores";
import type {
  OnboardingStep,
  PersonalInfo,
  ProfessionalProfile,
  Experience,
  Education,
  Skill,
  Language,
  TemplateSelection,
} from "../stores";

// Maximum time to wait for backend sync before proceeding with local state
const SYNC_TIMEOUT_MS = 3000;

export function useOnboardingSync() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.accessToken;

  const { data: backendProgress, isLoading, isError } = useOnboardingProgress();
  const saveProgress = useSaveOnboardingProgress();

  const { currentStep, hydrateFromBackend, getStateForBackend } = useOnboardingStore();

  const hasHydrated = useRef(false);
  const previousStep = useRef<OnboardingStep | null>(null);

  // Timeout state to prevent infinite loading
  const [timedOut, setTimedOut] = useState(false);

  // Set timeout to prevent infinite loading
  useEffect(() => {
    if (!isAuthenticated || hasHydrated.current || timedOut) return;

    const timeout = setTimeout(() => {
      if (isLoading && !hasHydrated.current) {
        console.warn("Onboarding sync timed out, proceeding with local state");
        setTimedOut(true);
      }
    }, SYNC_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, isLoading, timedOut]);

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
          personalInfo: backendProgress.personalInfo as unknown as PersonalInfo | null,
          username: backendProgress.username || null,
          professionalProfile:
            backendProgress.professionalProfile as unknown as ProfessionalProfile | null,
          experiences: (backendProgress.experiences || []) as unknown as Experience[],
          noExperience: backendProgress.noExperience || false,
          education: (backendProgress.education || []) as unknown as Education[],
          noEducation: backendProgress.noEducation || false,
          skills: (backendProgress.skills || []) as unknown as Skill[],
          noSkills: backendProgress.noSkills || false,
          languages: (backendProgress.languages || []) as unknown as Language[],
          templateSelection:
            backendProgress.templateSelection as unknown as TemplateSelection | null,
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
      // Cast to unknown first to allow type mismatch between local and API types
      saveProgress.mutate(state as unknown as Parameters<typeof saveProgress.mutate>[0]);
    }
    previousStep.current = currentStep;
  }, [currentStep, getStateForBackend, saveProgress, isAuthenticated]);

  // Manual save function for explicit saves
  const saveToBackend = useCallback(() => {
    if (!isAuthenticated) {
      return Promise.resolve({ success: false, currentStep: "", completedSteps: [] });
    }
    const state = getStateForBackend();
    // Cast to unknown first to allow type mismatch between local and API types
    return saveProgress.mutateAsync(
      state as unknown as Parameters<typeof saveProgress.mutateAsync>[0]
    );
  }, [getStateForBackend, saveProgress, isAuthenticated]);

  return {
    isLoading: status === "loading" || (isAuthenticated && isLoading && !timedOut && !isError),
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
