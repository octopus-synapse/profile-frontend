/**
 * Onboarding Feature
 */

// Types
export type {
  OnboardingStep,
  OnboardingState,
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
export {
  onboardingKeys,
  useOnboardingState,
  useSaveOnboardingProgress,
  useSubmitOnboarding,
  useSkipOnboarding,
  useResetOnboarding,
} from "./hooks";
