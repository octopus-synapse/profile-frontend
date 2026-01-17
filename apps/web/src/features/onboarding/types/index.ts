/**
 * Onboarding Domain Types
 * Types aligned with backend DTOs
 *
 * API-specific types (OnboardingProgress, OnboardingStatus, etc.) are
 * re-exported from @profile/api-client for consistency.
 */

// Re-export API types from api-client
export type {
  OnboardingProgress,
  OnboardingStatus,
  OnboardingResult,
  SaveProgressResult,
  SubmitOnboardingDto,
  PersonalInfoData,
  ProfessionalProfileData,
  ExperiencesStepData,
  EducationStepData,
  SkillsStepData,
  TemplateSelectionData,
} from "@profile/api-client";

// Re-export entity types from contracts
export type { Experience, Education, Skill, Language } from "@profile/api-client";

export interface OnboardingData {
  personalInfo?: import("@profile/api-client").PersonalInfoData;
  professionalProfile?: import("@profile/api-client").ProfessionalProfileData;
  experiencesStep?: import("@profile/api-client").ExperiencesStepData;
  educationStep?: import("@profile/api-client").EducationStepData;
  skillsStep?: import("@profile/api-client").SkillsStepData;
  languages?: import("@profile/api-client").Language[];
  templateSelection?: import("@profile/api-client").TemplateSelectionData;
}
