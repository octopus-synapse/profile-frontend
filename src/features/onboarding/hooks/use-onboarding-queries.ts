"use client";

/**
 * Onboarding Queries
 */

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { onboardingRepository } from "../services/onboarding-repository";
import { onboardingKeys } from "./query-keys";

/**
 * Get onboarding status
 */
export function useOnboardingStatus() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: onboardingKeys.status(),
    queryFn: () => onboardingRepository.getStatus(),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!session?.accessToken,
  });
}

/**
 * Get onboarding progress (checkpoint)
 */
export function useOnboardingProgress() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: onboardingKeys.progress(),
    queryFn: () => onboardingRepository.getProgress(),
    staleTime: 0, // Always fetch fresh progress
    enabled: !!session?.accessToken, // Only fetch when authenticated
  });
}
