/**
 * Onboarding Feature
 *
 * Note: onboardingRepository has been removed - use apiClient.onboarding instead.
 * This ensures web and mobile share the same implementation via @profile/api-client.
 */

// Types from api-client (for API communication)
export type {
  OnboardingData,
  PersonalInfoData,
  ProfessionalProfileData,
  TemplateSelectionData,
  SubmitOnboardingDto,
  ExperiencesStepData,
  EducationStepData,
  SkillsStepData,
  OnboardingProgress,
  OnboardingStatus,
  OnboardingResult,
  SaveProgressResult,
} from "./types";

// Hooks
export { onboardingKeys, useOnboardingStatus, useSubmitOnboarding } from "./hooks";

// Store-based system (local types for UI)
export { useOnboardingStore, ONBOARDING_STEPS } from "./stores";
export type {
  PersonalInfo,
  ProfessionalProfile,
  Experience,
  Education,
  Skill,
  Language,
  TemplateSelection,
  OnboardingStep,
} from "./stores";

// Components
export { OnboardingWizard, OnboardingShell, StepNavigation } from "./components";
