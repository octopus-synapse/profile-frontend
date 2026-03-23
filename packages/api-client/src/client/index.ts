/**
 * Client Module
 *
 * Exports HTTP client utilities for API communication.
 */

// Server-side session validation (with cookie forwarding)
export { authSessionServer, authSessionServer as authSession } from './auth-session-server';
export type { ApiError } from './fetcher';
export { customFetch, getApiLocale, isApiError, setApiLocale } from './fetcher';

// Backend-unwrapping fetch (replaces httpClient)
export { apiFetch } from './api-fetch';
