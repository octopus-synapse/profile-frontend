/**
 * CSRF Protection Utilities
 * Implements CSRF token management for state-changing requests
 *
 * Security Note: This implementation uses the double-submit cookie pattern
 * combined with Next.js Server Actions for maximum protection.
 */

const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_TOKEN_LENGTH = 32;

// ============================================================================
// Token Generation
// ============================================================================

/**
 * Generate a cryptographically secure random token
 */
function generateToken(): string {
  if (typeof window === 'undefined') {
    // Server-side: use Node.js crypto
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require('node:crypto') as {
      randomBytes: (size: number) => { toString: (encoding: string) => string };
    };
    return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
  }

  // Client-side: use Web Crypto API
  const array = new Uint8Array(CSRF_TOKEN_LENGTH);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// ============================================================================
// Cookie Management
// ============================================================================

/**
 * Get CSRF token from cookie
 */
export function getCsrfTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === CSRF_COOKIE_NAME && value) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * Set CSRF token in cookie
 * Uses Secure, SameSite=Strict for maximum protection
 */
export function setCsrfTokenCookie(token: string): void {
  if (typeof document === 'undefined') return;

  const isSecure = window.location.protocol === 'https:';
  const cookieOptions = [
    `${CSRF_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'SameSite=Strict',
    isSecure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');

  document.cookie = cookieOptions;
}

// ============================================================================
// Token Management
// ============================================================================

/**
 * Get or generate CSRF token
 * Implements lazy token generation with cookie persistence
 */
export function getCsrfToken(): string {
  // Try to get existing token from cookie
  let token = getCsrfTokenFromCookie();

  // Generate new token if not present
  if (!token) {
    token = generateToken();
    setCsrfTokenCookie(token);
  }

  return token;
}

/**
 * Async version for HTTP client compatibility
 */
export function getCsrfTokenAsync(): string | null {
  if (typeof window === 'undefined') return null;
  return getCsrfToken();
}

/**
 * Rotate CSRF token (call after successful state-changing operations)
 * This provides additional protection against token fixation attacks
 */
export function rotateCsrfToken(): string {
  const newToken = generateToken();
  setCsrfTokenCookie(newToken);
  return newToken;
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate CSRF token from request header against cookie
 * Use this in API routes or Server Actions
 */
export function validateCsrfToken(headerToken: string | null, cookieToken: string | null): boolean {
  if (!headerToken || !cookieToken) return false;

  // Constant-time comparison to prevent timing attacks
  if (headerToken.length !== cookieToken.length) return false;

  let result = 0;
  for (let i = 0; i < headerToken.length; i++) {
    result |= headerToken.charCodeAt(i) ^ cookieToken.charCodeAt(i);
  }
  return result === 0;
}
