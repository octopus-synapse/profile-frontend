/**
 * Custom Fetch Instance for Orval
 *
 * This is the ONLY place where HTTP requests are configured.
 * All authentication, headers, and error handling lives here.
 *
 * Signature: (url: string, options?: RequestInit) => Promise<T>
 * This matches Orval's expected mutator format.
 */

/**
 * API Configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Token storage key
 */
const TOKEN_KEY = "auth_token";

/**
 * Get stored auth token
 */
function getAuthToken(): string | null {
 if (typeof window === "undefined") return null;
 return localStorage.getItem(TOKEN_KEY);
}

/**
 * Set auth token
 */
export function setAuthToken(token: string): void {
 if (typeof window === "undefined") return;
 localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Clear auth token
 */
export function clearAuthToken(): void {
 if (typeof window === "undefined") return;
 localStorage.removeItem(TOKEN_KEY);
}

/**
 * API Error structure from backend
 */
export interface ApiError {
 code: string;
 message: string;
 statusCode: number;
 details?: Record<string, unknown>;
}

/**
 * Check if error is API error
 */
export function isApiError(error: unknown): error is ApiError {
 return (
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  "message" in error &&
  "statusCode" in error
 );
}

/**
 * Custom fetch function for Orval
 *
 * This is used by all generated API hooks.
 * Automatically injects auth token and handles errors.
 */
export async function customFetch<T>(
 url: string,
 options?: RequestInit,
): Promise<T> {
 // Build full URL
 const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

 // Build request headers
 const headers = new Headers(options?.headers);

 // Set defaults
 if (!headers.has("Content-Type")) {
  headers.set("Content-Type", "application/json");
 }
 if (!headers.has("Accept")) {
  headers.set("Accept", "application/json");
 }

 // Inject auth token if available
 const token = getAuthToken();
 if (token && !headers.has("Authorization")) {
  headers.set("Authorization", `Bearer ${token}`);
 }

 // Execute request
 const response = await fetch(fullUrl, {
  ...options,
  headers,
  credentials: "include",
 });

 // Handle response
 if (!response.ok) {
  let errorBody: ApiError;

  try {
   errorBody = await response.json();
  } catch {
   errorBody = {
    code: "NETWORK_ERROR",
    message: `HTTP ${response.status}: ${response.statusText}`,
    statusCode: response.status,
   };
  }

  // Handle 401 - clear token
  if (response.status === 401) {
   clearAuthToken();
  }

  throw errorBody;
 }

 // Handle empty responses (204 No Content)
 if (response.status === 204) {
  return { data: undefined, status: 204, headers: response.headers } as T;
 }

 // Parse JSON response and wrap in expected format
 const data = await response.json();
 return { data, status: response.status, headers: response.headers } as T;
}

export default customFetch;
