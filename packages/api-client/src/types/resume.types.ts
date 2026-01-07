/**
 * Resume Domain Types
 * API types for resume-related operations
 *
 * NAMING CONVENTION:
 * - ResumeXxx: Persisted entities with id, resumeId, order (API responses)
 * - CreateXxxDto: DTOs for creating new entities
 *
 * For validation schemas, use @octopus-synapse/profile-contracts.
 */

import {
 type LanguageProficiency,
 LanguageProficiencyEnum,
} from "@octopus-synapse/profile-contracts";

// Re-export for convenience
export { LanguageProficiencyEnum };
export type { LanguageProficiency };

export type ResumeTemplate = "MODERN" | "CLASSIC" | "MINIMAL" | "PROFESSIONAL";
export type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
/** @deprecated Use LanguageProficiency from contracts */
export type LanguageLevel = LanguageProficiency;

// ============================================================================
// Persisted Entity Types (API Responses)
// ============================================================================

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

 // Personal info
 fullName: string | null;
 jobTitle: string | null;
 phone: string | null;
 emailContact: string | null;
 location: string | null;
 linkedin: string | null;
 github: string | null;
 website: string | null;

 // Theme
 activeThemeId: string | null;

 // Relations
 experiences: ResumeExperience[];
 educations: ResumeEducation[];
 skills: ResumeSkill[];
 languages: ResumeLanguage[];
 certifications: ResumeCertification[];
 projects: ResumeProject[];
}

/** Persisted experience entity with database fields */
export interface ResumeExperience {
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

/** Persisted education entity with database fields */
export interface ResumeEducation {
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

/** Persisted skill entity with database fields */
export interface ResumeSkill {
 id: string;
 resumeId: string;
 name: string;
 level: SkillLevel;
 category: string | null;
 order: number;
}

/** Persisted language entity with database fields */
export interface ResumeLanguage {
 id: string;
 resumeId: string;
 name: string;
 level: LanguageLevel;
 cefrLevel?: string | null;
 order: number;
}

/** Persisted certification entity with database fields */
export interface ResumeCertification {
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

/** Persisted project entity with database fields */
export interface ResumeProject {
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

// ============================================================================
// Backward Compatibility Aliases
// ============================================================================

/** @deprecated Use ResumeCertification */
export type Certification = ResumeCertification;
/** @deprecated Use ResumeProject */
export type Project = ResumeProject;

// ============================================================================
// DTOs for Create/Update
// ============================================================================

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
 fullName?: string;
 jobTitle?: string;
 phone?: string;
 emailContact?: string;
 location?: string;
 linkedin?: string;
 github?: string;
 website?: string;
 activeThemeId?: string;
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
 cefrLevel?: string;
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

// ============================================================================
// List/Filter Types
// ============================================================================

export interface ResumeListItem {
 id: string;
 title: string;
 template: ResumeTemplate;
 isPublic: boolean;
 slug: string | null;
 updatedAt: string;
}
