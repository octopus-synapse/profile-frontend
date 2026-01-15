/**
 * Onboarding Repository
 * Handles onboarding-related API calls
 */

import type { HttpClient } from "../client";
import type {
 SubmitOnboardingDto,
 OnboardingStatus,
 OnboardingProgress,
 OnboardingResult,
 SaveProgressResult,
} from "../types";

const BASE_URL = "/v1/onboarding";

export function createOnboardingRepository(client: HttpClient) {
 return {
  /**
   * Get current onboarding status
   */
  async getStatus(): Promise<OnboardingStatus> {
   return client.get<OnboardingStatus>(`${BASE_URL}/status`);
  },

  /**
   * Get onboarding progress (checkpoint)
   */
  async getProgress(): Promise<OnboardingProgress> {
   return client.get<OnboardingProgress>(`${BASE_URL}/progress`);
  },

  /**
   * Save onboarding progress (checkpoint)
   */
  async saveProgress(data: OnboardingProgress): Promise<SaveProgressResult> {
   return client.put<SaveProgressResult>(`${BASE_URL}/progress`, data);
  },

  /**
   * Submit complete onboarding
   */
  async submit(data: SubmitOnboardingDto): Promise<OnboardingResult> {
   return client.post<OnboardingResult>(BASE_URL, data);
  },

  /**
   * Skip onboarding
   */
  async skip(): Promise<void> {
   return client.post(`${BASE_URL}/skip`);
  },

  /**
   * Check if user has completed onboarding
   * @deprecated Use getStatus() instead
   */
  async checkStatus(): Promise<{ hasCompletedOnboarding: boolean }> {
   return client.get<{ hasCompletedOnboarding: boolean }>(`${BASE_URL}/status`);
  },
 };
}

export type OnboardingRepository = ReturnType<
 typeof createOnboardingRepository
>;
