/**
 * Resume Domain Types
 * Based on profile-services Prisma schema
 */

export type ResumeTemplate = "MODERN" | "CLASSIC" | "MINIMAL" | "PROFESSIONAL";
export type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
export type LanguageLevel = "BASIC" | "INTERMEDIATE" | "ADVANCED" | "FLUENT" | "NATIVE";

export interface Resume {
  id: string;
  userId: string;
  title: string;
  summary: string | null;
  template: ResumeTemplate;
  isPublic: boolean;
  slug: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
}

export interface Experience {
  id: string;
  resumeId: string;
  company: string;
  position: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string | null;
  achievements: string[];
  order: number;
}

export interface Education {
  id: string;
  resumeId: string;
  institution: string;
  degree: string;
  field: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string | null;
  gpa: string | null;
  order: number;
}

export interface Skill {
  id: string;
  resumeId: string;
  name: string;
  level: SkillLevel;
  category: string | null;
  order: number;
}

export interface Language {
  id: string;
  resumeId: string;
  name: string;
  level: LanguageLevel;
  order: number;
}

export interface Certification {
  id: string;
  resumeId: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  order: number;
}

export interface Project {
  id: string;
  resumeId: string;
  name: string;
  description: string | null;
  url: string | null;
  repositoryUrl: string | null;
  technologies: string[];
  startDate: string | null;
  endDate: string | null;
  order: number;
}

// DTOs for create/update
export interface CreateResumeDto {
  title: string;
  summary?: string;
  template?: ResumeTemplate;
  isPublic?: boolean;
}

export interface UpdateResumeDto {
  title?: string;
  summary?: string;
  template?: ResumeTemplate;
  isPublic?: boolean;
  slug?: string;
}

export interface CreateExperienceDto {
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  achievements?: string[];
}

export interface CreateEducationDto {
  institution: string;
  degree: string;
  field?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  gpa?: string;
}

export interface CreateSkillDto {
  name: string;
  level?: SkillLevel;
  category?: string;
}

export interface CreateLanguageDto {
  name: string;
  level: LanguageLevel;
}

export interface CreateCertificationDto {
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  url?: string;
  repositoryUrl?: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
}

// List/filter types
export interface ResumeListItem {
  id: string;
  title: string;
  template: ResumeTemplate;
  isPublic: boolean;
  slug: string | null;
  updatedAt: string;
}
