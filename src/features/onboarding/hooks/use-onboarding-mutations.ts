"use client";

/**
 * Onboarding Mutations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onboardingRepository } from "../services/onboarding-repository";
import { onboardingKeys } from "./query-keys";
import { userKeys } from "../../users/hooks/query-keys";
import type { OnboardingStep, OnboardingData, SubmitOnboardingDto } from "../types";

/**
 * Save progress on current step
 */
export function useSaveOnboardingProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ step, data }: { step: OnboardingStep; data: Partial<OnboardingData> }) =>
      onboardingRepository.saveProgress(step, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.state() });
    },
  });
}

/**
 * Submit onboarding (complete)
 */
export function useSubmitOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitOnboardingDto) => onboardingRepository.submit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.state() });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
}

/**
 * Skip onboarding
 */
export function useSkipOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => onboardingRepository.skip(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.state() });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
}

/**
 * Reset onboarding
 */
export function useResetOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => onboardingRepository.reset(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.state() });
    },
  });
}
