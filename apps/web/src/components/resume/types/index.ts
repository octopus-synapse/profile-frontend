/**
 * Resume Domain Types
 *
 * ARCHITECTURE DECISION: This module re-exports types from @profile/api-client
 * which is the single source of truth for API types. Only UI-specific types
 * (config, presets) are defined locally.
 *
 * @see ADR-000X — Enforce Disciplined, Persona-Aware Engineering
 */

// =============================================================================
// UI-Specific Configuration (local)
// =============================================================================
export * from "./config";
export * from "./presets";

// =============================================================================
// API Types (re-exported from @profile/api-client)
// =============================================================================
export type {
  // Entity Types
  Resume,
  ResumeExperience,
  ResumeEducation,
  ResumeSkill,
  ResumeLanguage,
  ResumeCertification,
  ResumeProject,
  // Enums
  ResumeTemplate,
  SkillLevel,
  LanguageLevel,
  // DTOs
  CreateResumeDto,
  UpdateResumeDto,
  CreateExperienceDto,
  CreateEducationDto,
  CreateSkillDto,
  CreateLanguageDto,
  CreateCertificationDto,
  CreateProjectDto,
  ResumeListItem,
} from "@profile/api-client";

// =============================================================================
// Backward Compatibility Aliases
// =============================================================================
export type { ResumeExperience as Experience } from "@profile/api-client";
export type { ResumeEducation as Education } from "@profile/api-client";
export type { ResumeSkill as Skill } from "@profile/api-client";
export type { ResumeLanguage as Language } from "@profile/api-client";
export type { ResumeCertification as Certification } from "@profile/api-client";
export type { ResumeProject as Project } from "@profile/api-client";
