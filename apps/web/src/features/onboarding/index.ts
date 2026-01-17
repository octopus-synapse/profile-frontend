/**
 * Onboarding Feature
 *
 * Note: onboardingRepository has been removed - use apiClient.onboarding instead.
 * This ensures web and mobile share the same implementation via @profile/api-client.
 */

// Types
export type {
  OnboardingData,
  PersonalInfoData,
  ProfessionalProfileData,
  ExperienceData,
  EducationData,
  SkillData,
  LanguageData,
  TemplateSelectionData,
  SubmitOnboardingDto,
  // API types (re-exported from api-client)
  OnboardingProgress,
  OnboardingStatus,
  OnboardingResult,
  SaveProgressResult,
} from "./types";

// Hooks
export { onboardingKeys, useOnboardingStatus, useSubmitOnboarding } from "./hooks";

// Store-based system
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
