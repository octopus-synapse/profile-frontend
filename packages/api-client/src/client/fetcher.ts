/**
 * Custom Fetch Instance for Orval
 *
 * This is the ONLY place where HTTP requests are configured.
 * Authentication is handled via httpOnly cookies set by the backend.
 *
 * Signature: (url: string, options?: RequestInit) => Promise<T>
 * This matches Orval's expected mutator format.
 */

/**
 * API Configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// ============================================================================
// Global Locale Injection
// Backend-Driven UI: all API calls include ?locale= so the backend
// resolves translations before sending them to the frontend.
// ============================================================================

let _currentLocale: string | null = null;

/**
 * Set the current locale for all API requests.
 * Called once by the I18nProvider when locale changes.
 */
export function setApiLocale(locale: string): void {
  _currentLocale = locale;
}

/**
 * Get the current locale for API requests.
 */
export function getApiLocale(): string | null {
  return _currentLocale;
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
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'statusCode' in error
  );
}

/**
 * Custom fetch function for Orval
 *
 * This is used by all generated API hooks.
 * Authentication is handled via httpOnly session cookie.
 * credentials: "include" sends the cookie automatically.
 */
export async function customFetch<T>(url: string, options?: RequestInit): Promise<T> {
  // Build full URL with locale injection
  let fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

  // Inject locale query param for Backend-Driven UI
  if (_currentLocale) {
    const separator = fullUrl.includes('?') ? '&' : '?';
    fullUrl = `${fullUrl}${separator}locale=${_currentLocale}`;
  }

  // Build request headers
  const headers = new Headers(options?.headers);

  // Set defaults
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  // Execute request with credentials to send httpOnly cookies
  const response = await fetch(fullUrl, {
    ...options,
    headers,
    credentials: 'include', // CRITICAL: sends httpOnly session cookie
  });

  // Handle response
  if (!response.ok) {
    let errorBody: ApiError;

    try {
      errorBody = await response.json();
    } catch {
      errorBody = {
        code: 'NETWORK_ERROR',
        message: `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status,
      };
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
