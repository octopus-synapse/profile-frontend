"use client";

/**
 * Onboarding Queries
 *
 * Uses @profile/api-client for all API calls.
 * This ensures web and mobile share the same implementation.
 */

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiClient } from "@/shared/lib/api-client";
import { onboardingKeys } from "./query-keys";

/**
 * Get onboarding status
 */
export function useOnboardingStatus() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: onboardingKeys.status(),
    queryFn: () => apiClient.onboarding.getStatus(),
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
    queryFn: () => apiClient.onboarding.getProgress(),
    staleTime: 0, // Always fetch fresh progress
    enabled: !!session?.accessToken, // Only fetch when authenticated
  });
}
