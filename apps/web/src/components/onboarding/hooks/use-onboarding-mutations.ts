"use client";

/**
 * Onboarding Mutations
 *
 * Uses @profile/api-client for all API calls.
 * This ensures web and mobile share the same implementation.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { onboardingKeys } from "./query-keys";
import { userKeys } from "../../users/hooks/query-keys";
import type { SubmitOnboardingDto, OnboardingProgress } from "./types";

/**
 * Submit onboarding (complete)
 */
export function useSubmitOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitOnboardingDto) => apiClient.onboarding.submit(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: onboardingKeys.status() });
      void queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });
      void queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
}

/**
 * Save onboarding progress (checkpoint)
 */
export function useSaveOnboardingProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OnboardingProgress) => apiClient.onboarding.saveProgress(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });
    },
  });
}
