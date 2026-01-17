/**
 * Onboarding Domain Types
 * API types for onboarding operations
 *
 * IMPORTANT: Entity types (Experience, Education, Skill, Language) are
 * imported from @octopus-synapse/profile-contracts (single source of truth).
 * Only API-specific types (steps, DTOs, responses) are defined here.
 */

import { z } from "zod";
import {
 PersonalInfoSchema,
 ProfessionalProfileSchema,
 type Experience,
 type Education,
 type Skill,
 type Language,
} from "@octopus-synapse/profile-contracts";

// Re-export contract types for convenience
export type { Experience, Education, Skill, Language };

// ============================================================================
// Step Types
// ============================================================================

// Core API steps that the backend understands
export type OnboardingApiStep =
 | "personal-info"
 | "professional-profile"
 | "experiences"
 | "education"
 | "skills"
 | "languages"
 | "template";

// Extended step type for frontend (includes UI-only steps)
// Frontend can use any string, but OnboardingApiStep values are recommended
export type OnboardingStep = string;

// ============================================================================
// Data Types (Using Contracts)
// ============================================================================

export type PersonalInfoData = z.infer<typeof PersonalInfoSchema>;
export type ProfessionalProfileData = z.infer<typeof ProfessionalProfileSchema>;

// Step wrapper types (API-specific, not in contracts)
export interface ExperiencesStepData {
 experiences: Experience[];
 noExperience: boolean;
}

export interface EducationStepData {
 education: Education[];
 noEducation: boolean;
}

export interface SkillsStepData {
 skills: Skill[];
 noSkills: boolean;
}

// Template selection (API-specific)
export interface TemplateSelectionData {
 template: string;
 palette: string;
}

// Complete onboarding data structure
export interface OnboardingData {
 personalInfo?: PersonalInfoData;
 professionalProfile?: ProfessionalProfileData;
 experiencesStep?: ExperiencesStepData;
 educationStep?: EducationStepData;
 skillsStep?: SkillsStepData;
 languages?: Language[];
 templateSelection?: TemplateSelectionData;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface OnboardingStatus {
 hasCompletedOnboarding: boolean;
 onboardingCompletedAt?: string;
}

export interface OnboardingProgress {
 currentStep: OnboardingStep;
 completedSteps: OnboardingStep[];
 username: string | null;
 personalInfo?: PersonalInfoData;
 professionalProfile?: ProfessionalProfileData;
 experiences: Experience[];
 noExperience: boolean;
 education: Education[];
 noEducation: boolean;
 skills: Skill[];
 noSkills: boolean;
 languages: Language[];
 templateSelection: TemplateSelectionData | null;
}

export interface OnboardingResult {
 success: boolean;
 resumeId: string;
 message: string;
}

export interface SaveProgressResult {
 success: boolean;
 currentStep: string;
 completedSteps: string[];
}

// ============================================================================
// API DTO for submission
// ============================================================================

export interface SubmitOnboardingDto {
 username: string;
 personalInfo: PersonalInfoData;
 professionalProfile: ProfessionalProfileData;
 skillsStep: SkillsStepData;
 experiencesStep?: ExperiencesStepData;
 educationStep?: EducationStepData;
 languages?: Language[];
 templateSelection: TemplateSelectionData;
}
