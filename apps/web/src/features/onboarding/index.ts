/**
 * Onboarding Feature
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
} from "./types";

// Repository
export { onboardingRepository } from "./services/onboarding-repository";

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
