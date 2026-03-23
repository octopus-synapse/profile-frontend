/**
 * @profile/api-client
 *
 * Auto-generated SDK from backend OpenAPI specification.
 * Backend is the SINGLE SOURCE OF TRUTH for all types.
 *
 * Usage:
 *   import { useOnboardingGetProgress, type OnboardingProgressDto } from '@profile/api-client';
 *   import { userRepository } from '@profile/api-client';
 *
 * No local types, no local validation, no aliases — generated SDK names only.
 */

// ============================================================================
// GENERATED TYPES (from Swagger/OpenAPI)
// ============================================================================

export * from './generated/models';

// ============================================================================
// GENERATED SDK - API Hooks (React Query)
// ============================================================================

export * from './generated/api';

// ============================================================================
// ALIASES (for backward compatibility)
// ============================================================================

export {
  getAuthGetSessionQueryKey as getAuthSessionQueryKey,
  useAuthGetSession as useAuthSession,
} from './generated/api/auth/auth';

// ============================================================================
// REPOSITORIES (repository pattern wrappers over SDK functions)
// ============================================================================

export * from './repositories';

// ============================================================================
// CLIENT UTILITIES
// ============================================================================

export type { ApiError, authSessionServer } from './client';
export {
  authSession,
  customFetch,
  getApiLocale,
  isApiError,
  setApiLocale,
  apiFetch,
} from './client';

// ============================================================================
// CONSTANTS
// ============================================================================

export * from './constants';

// ============================================================================
// UTILITIES
// ============================================================================

export { safeLocalStorage, safeSessionStorage } from './utils/ssr-storage';
