/**
 * @profile/api-client
 *
 * Auto-generated SDK from backend OpenAPI specification.
 * Backend is the SINGLE SOURCE OF TRUTH for all types.
 *
 * Usage:
 *   import { useResumeImportGetStatus, type ImportJsonDto } from '@profile/api-client';
 *   import { userRepository, type UserProfileApi } from '@profile/api-client';
 *
 * No local types, no local validation - backend SDK only.
 */

// ============================================================================
// GENERATED TYPES (from Swagger/OpenAPI)
// ============================================================================

export * from "./generated/models";

// ============================================================================
// GENERATED SDK - API Hooks (React Query)
// ============================================================================

export * from "./generated/api";

// ============================================================================
// HOOK ALIASES (ergonomic names for common hooks)
// ============================================================================

export * from "./hooks";

// ============================================================================
// REPOSITORIES (repository pattern wrappers over SDK functions)
// ============================================================================

export * from "./repositories";

// ============================================================================
// CLIENT UTILITIES
// ============================================================================

export { setAuthToken, clearAuthToken, isApiError } from "./client";
export type { ApiError } from "./client";

// ============================================================================
// CONSTANTS
// ============================================================================

export * from "./constants";
