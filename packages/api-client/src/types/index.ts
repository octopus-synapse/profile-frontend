/**
 * API Types exports
 *
 * MIGRATION NOTE: Types are being centralized in @octopus-synapse/profile-contracts.
 * Local types are re-exported for backward compatibility but should be considered deprecated.
 * Import from profile-contracts instead when possible.
 */

// ============================================================================
// Re-exports from profile-contracts (preferred imports)
// ============================================================================
export {
 // Enums
 type UserRole,
 UserRoleSchema,
 UserRoles,
 type SkillLevel,
 SkillLevelSchema,
 SkillLevels,
 type ResumeStatus,
 ResumeStatusSchema,
 type LanguageProficiency,
 LanguageProficiencyEnum,
 type CefrLevel,
 CefrLevelEnum,
 // Types
 type User,
 UserSchema,
 type UserProfile,
 UserProfileSchema,
 type CheckUsernameResponse,
 type UserStats,
 type AuthTokens,
 AuthTokensSchema,
 type AuthResponse,
 type RefreshTokenResponse,
 type Resume,
 ResumeSchema,
 type ResumeExperience,
 type ResumeEducation,
 type ResumeSkill,
 type ResumeLanguage,
 type ResumeCertification,
 type ResumeProject,
 type ApiResponse,
 type ApiErrorResponse,
 type PaginatedResponse,
 type PaginationQuery,
 // DTOs
 type LoginCredentials,
 LoginCredentialsSchema,
 type RegisterCredentials,
 RegisterCredentialsSchema,
 type UpdateUser,
 UpdateUserSchema,
 type CreateResume,
 CreateResumeSchema,
 type UpdateResume,
 UpdateResumeSchema,
 type CreateExperience,
 type CreateEducation,
 type CreateSkill,
 type CreateLanguage,
} from "@octopus-synapse/profile-contracts";

// ============================================================================
// Local types (for types not yet in contracts)
// ============================================================================

// User types (extended local types)
export * from "./user.types";

// Resume types (extended local types)
export * from "./resume.types";

// Onboarding types
export * from "./onboarding.types";

// Theme types
export * from "./theme.types";

// Tech Skills types
export * from "./tech-skills.types";

// Admin types
export * from "./admin.types";

// Auth types (extended local types)
export * from "./auth.types";

// Common types
export * from "./common.types";
