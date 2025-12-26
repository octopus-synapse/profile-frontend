/**
 * Onboarding Repository
 * Handles onboarding flow API calls
 */

import { httpClient } from "@/shared/lib/http-client";
import type { OnboardingState, SubmitOnboardingDto } from "../types";

const BASE_URL = "/onboarding";

export const onboardingRepository = {
  /**
   * Get current onboarding state
   */
  async getState(): Promise<OnboardingState | null> {
    return httpClient.get<OnboardingState | null>(`${BASE_URL}/state`);
  },

  /**
   * Save onboarding progress (partial save)
   */
  async saveProgress(step: string, data: Record<string, unknown>): Promise<OnboardingState> {
    return httpClient.patch<OnboardingState>(`${BASE_URL}/progress`, {
      step,
      data,
    });
  },

  /**
   * Submit complete onboarding
   */
  async submit(data: SubmitOnboardingDto): Promise<{ success: boolean; resumeId: string }> {
    return httpClient.post<{ success: boolean; resumeId: string }>(`${BASE_URL}/submit`, data);
  },

  /**
   * Skip onboarding
   */
  async skip(): Promise<void> {
    return httpClient.post(`${BASE_URL}/skip`);
  },

  /**
   * Reset onboarding (start over)
   */
  async reset(): Promise<void> {
    return httpClient.delete(`${BASE_URL}/state`);
  },
};
