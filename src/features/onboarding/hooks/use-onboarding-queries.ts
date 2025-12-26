"use client";

/**
 * Onboarding Queries
 */

import { useQuery } from "@tanstack/react-query";
import { onboardingRepository } from "../services/onboarding-repository";
import { onboardingKeys } from "./query-keys";

/**
 * Get onboarding state
 */
export function useOnboardingState() {
  return useQuery({
    queryKey: onboardingKeys.state(),
    queryFn: () => onboardingRepository.getState(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
