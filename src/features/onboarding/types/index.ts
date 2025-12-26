/**
 * Onboarding Domain Types
 */

export type OnboardingStep =
  | "personal-info"
  | "professional-profile"
  | "experience"
  | "education"
  | "skills"
  | "languages"
  | "template-selection"
  | "complete";

export interface OnboardingState {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  data: OnboardingData;
}

export interface OnboardingData {
  personalInfo?: PersonalInfoData;
  professionalProfile?: ProfessionalProfileData;
  experience?: ExperienceData[];
  education?: EducationData[];
  skills?: SkillData[];
  languages?: LanguageData[];
  templateSelection?: TemplateSelectionData;
}

export interface PersonalInfoData {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface ProfessionalProfileData {
  title: string;
  summary: string;
  yearsOfExperience?: number;
}

export interface ExperienceData {
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  achievements?: string[];
}

export interface EducationData {
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface SkillData {
  name: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  category?: string;
}

export interface LanguageData {
  name: string;
  level: "BASIC" | "INTERMEDIATE" | "ADVANCED" | "FLUENT" | "NATIVE";
}

export interface TemplateSelectionData {
  template: "MODERN" | "CLASSIC" | "MINIMAL" | "PROFESSIONAL";
  primaryColor?: string;
}

// API DTOs
export interface SubmitOnboardingDto {
  personalInfo: PersonalInfoData;
  professionalProfile: ProfessionalProfileData;
  experience: ExperienceData[];
  education: EducationData[];
  skills: SkillData[];
  languages: LanguageData[];
  templateSelection: TemplateSelectionData;
}
