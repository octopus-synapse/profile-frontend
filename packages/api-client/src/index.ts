/**
 * @profile/api-client
 *
 * Auto-generated SDK from backend OpenAPI specification.
 * Backend is the SINGLE SOURCE OF TRUTH for all types.
 *
 * Usage:
 *   import { useAuthSession, type SessionResponseDto } from '@profile/api-client';
 *   import { selectEnvelopeData } from '@profile/api-client';
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
// CLIENT UTILITIES
// ============================================================================

export type { ApiError, authSessionServer } from './client';
export {
  apiFetch,
  authSession,
  customFetch,
  getApiLocale,
  isApiError,
  selectEnvelopeData,
  setApiLocale,
} from './client';

// ============================================================================
// CONSTANTS
// ============================================================================

export * from './constants';

// ============================================================================
// UTILITIES
// ============================================================================

export { safeLocalStorage, safeSessionStorage } from './utils/ssr-storage';
