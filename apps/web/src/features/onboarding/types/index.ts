/**
 * Onboarding Domain Types
 * Types aligned with backend DTOs
 */

export interface OnboardingData {
  personalInfo?: PersonalInfoData;
  professionalProfile?: ProfessionalProfileData;
  experiencesStep?: ExperiencesStepData;
  educationStep?: EducationStepData;
  skillsStep?: SkillsStepData;
  languages?: LanguageData[];
  templateSelection?: TemplateSelectionData;
}

export interface PersonalInfoData {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
}

export interface ProfessionalProfileData {
  jobTitle: string;
  summary: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

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
}

export interface TemplateSelectionData {
  template: string;
  palette: string;
}

// API DTO for submission
export interface SubmitOnboardingDto {
  username: string;
  personalInfo: PersonalInfoData;
  professionalProfile: ProfessionalProfileData;
  skills: Omit<SkillData, "id">[];
  noSkills: boolean;
  experiences: Omit<ExperienceData, "id">[];
  noExperience: boolean;
  education: Omit<EducationData, "id">[];
  noEducation: boolean;
  languages: Omit<LanguageData, "id">[];
  templateSelection: TemplateSelectionData;
}
