/**
 * Onboarding Domain Types
 * API types for onboarding operations
 */

import { z } from 'zod';
import {
  PersonalInfoSchema,
  ProfessionalProfileSchema,
} from '@octopus-synapse/profile-contracts';

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
// Frontend can use any string, but these are the recommended ones
export type OnboardingStep = OnboardingApiStep | string;

// ============================================================================
// Data Types (Using Contracts)
// ============================================================================

export type PersonalInfoData = z.infer<typeof PersonalInfoSchema>;
export type ProfessionalProfileData = z.infer<typeof ProfessionalProfileSchema>;

export interface ExperienceData {
 company: string;
 position: string;
 startDate: string;
 endDate?: string;
 isCurrent: boolean;
 description?: string;
 location?: string;
}

export interface ExperiencesStepData {
 experiences: ExperienceData[];
 noExperience: boolean;
}

export interface EducationData {
 institution: string;
 degree: string;
 field: string;
 startDate: string;
 endDate?: string;
 isCurrent: boolean;
}

export interface EducationStepData {
 education: EducationData[];
 noEducation: boolean;
}

export interface SkillData {
 name: string;
 category: string;
 level?: number;
}

export interface SkillsStepData {
 skills: SkillData[];
 noSkills: boolean;
}

export interface LanguageData {
 name: string;
 level: string;
 cefrLevel?: string;
}

export interface TemplateSelectionData {
 template: string;
 palette: string;
}

export interface OnboardingData {
 personalInfo?: PersonalInfoData;
 professionalProfile?: ProfessionalProfileData;
 experiencesStep?: ExperiencesStepData;
 educationStep?: EducationStepData;
 skillsStep?: SkillsStepData;
 languages?: LanguageData[];
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
 username?: string | null;
 personalInfo: PersonalInfoData | null;
 professionalProfile: ProfessionalProfileData | null;
 experiences: ExperienceData[];
 noExperience: boolean;
 education: EducationData[];
 noEducation: boolean;
 skills: SkillData[];
 noSkills: boolean;
 languages: LanguageData[];
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
 languages?: LanguageData[];
 templateSelection: TemplateSelectionData;
}
