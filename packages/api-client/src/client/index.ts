/**
 * Client Module
 *
 * Exports HTTP client utilities for API communication.
 */

// Server-side session validation (with cookie forwarding)
export { authSessionServer } from './auth-session-server';
export type { ApiError } from './fetcher';
export {
  clearAuthToken,
  customFetch,
  getApiLocale,
  isApiError,
  setApiLocale,
  setAuthToken,
} from './fetcher';
