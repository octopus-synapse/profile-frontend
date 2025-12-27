"use client";

/**
 * Onboarding Mutations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  onboardingRepository,
  type OnboardingProgress,
} from "../services/onboarding-repository";
import { onboardingKeys } from "./query-keys";
import { userKeys } from "../../users/hooks/query-keys";
import type { SubmitOnboardingDto } from "../types";

/**
 * Submit onboarding (complete)
 */
export function useSubmitOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitOnboardingDto) => onboardingRepository.submit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.status() });
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
}

/**
 * Save onboarding progress (checkpoint)
 */
export function useSaveOnboardingProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OnboardingProgress) => onboardingRepository.saveProgress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });
    },
  });
}
