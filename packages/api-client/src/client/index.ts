/**
 * Client Module
 *
 * Exports HTTP client utilities for API communication.
 */

// Backend-unwrapping fetch (replaces httpClient)
export { apiFetch } from './api-fetch';
// Server-side session validation (with cookie forwarding)
export { authSessionServer, authSessionServer as authSession } from './auth-session-server';
export type { ApiError } from './fetcher';
export { customFetch, getApiLocale, isApiError, setApiLocale } from './fetcher';
export { selectEnvelopeData } from './select-envelope-data';
