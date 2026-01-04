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
import type { OnboardingStep } from "../stores";

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

  // FIX: Track last saved timestamp for UI feedback
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<Error | null>(null);

  // Set timeout to prevent infinite loading
  useEffect(() => {
    if (!isAuthenticated || hasHydrated.current) return;

    const timeout = setTimeout(() => {
      if (isLoading && !hasHydrated.current) {
        console.warn("Onboarding sync timed out, proceeding with local state");
        setTimedOut(true);
        hasHydrated.current = true;
      }
    }, SYNC_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, isLoading]);

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

    // PRAGMATIC FIX: Also mark as hydrated if query fails or times out
    // This prevents infinite waiting in tests when backend is unavailable
    if (!hasHydrated.current && isAuthenticated && (isError || timedOut)) {
      hasHydrated.current = true;
      previousStep.current = currentStep;
    }

    // PRAGMATIC FIX: Mark as hydrated when query completes with no data (initial state)
    // This happens when backend returns empty or when using mocks
    if (!hasHydrated.current && isAuthenticated && !isLoading && !backendProgress) {
      hasHydrated.current = true;
      previousStep.current = currentStep;
    }
  }, [
    backendProgress,
    hydrateFromBackend,
    currentStep,
    isAuthenticated,
    isError,
    timedOut,
    isLoading,
  ]);

  // Save progress to backend when step changes (only if authenticated)
  // FIX: Removed race condition - now saves on EVERY step change including first one
  useEffect(() => {
    if (!isAuthenticated || !hasHydrated.current) return;

    // Skip if this is the first render (no actual step change yet)
    if (previousStep.current === currentStep) return;

    const saveCurrentProgress = async () => {
      try {
        const state = getStateForBackend();

        // FIX: Now using mutateAsync to await the save
        await saveProgress.mutateAsync(state);

        // FIX: Update last saved timestamp AFTER successful save
        setLastSavedAt(new Date());
        setSaveError(null); // Clear any previous errors
      } catch (error) {
        // FIX: Set error state but do NOT update lastSavedAt
        setSaveError(error instanceof Error ? error : new Error("Save failed"));
        // User will see error in UI via saveError state
      }
    };

    // FIX: Debounce to avoid excessive saves during rapid navigation
    const timer = setTimeout(saveCurrentProgress, 300);

    // Update previousStep AFTER setting up the save
    previousStep.current = currentStep;

    return () => clearTimeout(timer);
  }, [currentStep, getStateForBackend, saveProgress, isAuthenticated]);

  // Manual save function for explicit saves
  const saveToBackend = useCallback(async () => {
    if (!isAuthenticated) {
      console.warn("[Onboarding Sync] Cannot save - user not authenticated");
      return Promise.resolve({ success: false, currentStep: "", completedSteps: [] });
    }

    try {
      const state = getStateForBackend();
      console.log("[Onboarding Sync] Manual save triggered");
      const result = await saveProgress.mutateAsync(state);

      // FIX: Update lastSavedAt on manual save too
      setLastSavedAt(new Date());
      setSaveError(null);

      console.log("[Onboarding Sync] ✅ Manual save successful");
      return result;
    } catch (error) {
      console.error("[Onboarding Sync] ❌ Manual save failed:", error);
      // FIX: Set error state on manual save failure
      setSaveError(error instanceof Error ? error : new Error("Manual save failed"));
      throw error; // Re-throw so caller can handle it
    }
  }, [getStateForBackend, saveProgress, isAuthenticated]);

  return {
    isLoading:
      status === "loading" ||
      (isAuthenticated && isLoading && !timedOut && !isError && !hasHydrated.current),
    isHydrated: hasHydrated.current, // EXPOSED for testing
    isError,
    isSaving: saveProgress.isPending,
    lastSavedAt, // FIX: Expose for UI feedback
    saveError, // FIX: Use our state instead of mutation error
    saveToBackend,
    isAuthenticated,
  };
}

// Helper to get step index - use the same list as ONBOARDING_STEPS
function getStepIndex(step: OnboardingStep): number {
  return ONBOARDING_STEPS.findIndex((s) => s.id === step);
}
