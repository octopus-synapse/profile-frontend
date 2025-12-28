/**
 * Onboarding Repository
 * Handles onboarding flow API calls
 *
 * Note: This feature has complex local types that extend the API types.
 * It uses the base HTTP client and local types to maintain compatibility
 * with the onboarding-store.
 */

import { httpClient } from "@/shared/lib/http-client";
import type { SubmitOnboardingDto } from "../types";
import type {
  OnboardingStep,
  PersonalInfo,
  ProfessionalProfile,
  Experience,
  Education,
  Skill,
  Language,
  TemplateSelection,
} from "../stores";

const BASE_URL = "/onboarding";

interface OnboardingStatus {
  hasCompletedOnboarding: boolean;
  onboardingCompletedAt?: string;
}

interface OnboardingResult {
  success: boolean;
  resumeId: string;
  message: string;
}

export interface OnboardingProgress {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  personalInfo: PersonalInfo | null;
  professionalProfile: ProfessionalProfile | null;
  experiences: Experience[];
  noExperience: boolean;
  education: Education[];
  noEducation: boolean;
  skills: Skill[];
  noSkills: boolean;
  languages: Language[];
  templateSelection: TemplateSelection | null;
}

interface SaveProgressResult {
  success: boolean;
  currentStep: string;
  completedSteps: string[];
}

export const onboardingRepository = {
  /**
   * Get current onboarding status
   */
  async getStatus(): Promise<OnboardingStatus> {
    return httpClient.get<OnboardingStatus>(`${BASE_URL}/status`);
  },

  /**
   * Get onboarding progress (checkpoint)
   */
  async getProgress(): Promise<OnboardingProgress> {
    return httpClient.get<OnboardingProgress>(`${BASE_URL}/progress`);
  },

  /**
   * Save onboarding progress (checkpoint)
   */
  async saveProgress(data: OnboardingProgress): Promise<SaveProgressResult> {
    return httpClient.put<SaveProgressResult>(`${BASE_URL}/progress`, data);
  },

  /**
   * Submit complete onboarding
   */
  async submit(data: SubmitOnboardingDto): Promise<OnboardingResult> {
    return httpClient.post<OnboardingResult>(BASE_URL, data);
  },
};
