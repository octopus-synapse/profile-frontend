"use client";

/**
 * Onboarding Mutations
 * FIX: Added retry logic, error handling, and toast notifications
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  onboardingRepository,
  type OnboardingProgress,
} from "../services/onboarding-repository";
import { onboardingKeys } from "./query-keys";
import { userKeys } from "../../users/hooks/query-keys";
import type { SubmitOnboardingDto } from "../types";

/**
 * Submit onboarding (complete)
 * FIX: Added retry logic and better error handling
 */
export function useSubmitOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitOnboardingDto) => onboardingRepository.submit(data),

    // FIX: Retry up to 2 times on network errors
    retry: (failureCount, error: any) => {
      // Don't retry on validation errors (4xx except 408, 429)
      if (error?.statusCode >= 400 && error?.statusCode < 500) {
        if (error.statusCode === 408 || error.statusCode === 429) {
          return failureCount < 2; // Retry on timeout/rate limit
        }
        return false; // Don't retry on other 4xx
      }
      // Retry on 5xx errors or network errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.status() });
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });

      // Success feedback is handled in the complete-step component
      console.log('[Onboarding] ✅ Submission successful');
    },

    onError: (error: any) => {
      console.error('[Onboarding] ❌ Submission failed:', error);
      // Error is handled in the review-step component
      // We don't show toast here to avoid duplicate notifications
    },
  });
}

/**
 * Save onboarding progress (checkpoint)
 * FIX: Added retry logic, error handling, and user feedback
 */
export function useSaveOnboardingProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OnboardingProgress) => onboardingRepository.saveProgress(data),

    // FIX: Aggressive retry for save progress (user's data is precious!)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });

      // FIX: Show subtle success feedback
      // Using toast.success with short duration so it's not annoying
      toast.success("Progresso salvo", {
        duration: 2000,
        position: "bottom-right",
      });

      console.log('[Onboarding] ✅ Progress saved');
    },

    onError: (error: any) => {
      console.error('[Onboarding] ❌ Failed to save progress after retries:', error);

      // FIX: Show error with action to retry
      toast.error("Não foi possível salvar seu progresso", {
        description: "Verifique sua conexão e tente novamente.",
        duration: 5000,
        position: "bottom-right",
        action: {
          label: "Tentar novamente",
          onClick: () => {
            // User can manually trigger a save via the UI
            console.log('[Onboarding] User requested manual retry');
          },
        },
      });
    },
  });
}
