/**
 * Temporary User Test Helper
 * Provides E2E test utilities for creating and managing temporary users.
 *
 * Decision Posture: Kent Beck + Martin Fowler
 * - Clean test data management via automatic TTL-based cleanup
 * - Real users for realistic E2E testing
 * - Zero test data pollution in development/staging environments
 */

import { getApiBaseUrl } from '@profile/api-client';

/**
 * Temporary user creation request
 */
export interface CreateTemporaryUserRequest {
  /** Valid email address */
  email: string;
  /** Password (min 8 characters) */
  password: string;
  /** Optional display name */
  name?: string;
  /** Time-to-live in seconds (60s - 7 days, default 24 hours) */
  ttlSeconds?: number;
}

/**
 * Response from creating a temporary user
 */
export interface TemporaryUserResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    isTemporary: boolean;
    expiresAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

/**
 * Default TTL values for different test scenarios
 */
export const TTL = {
  /** 5 minutes - for quick tests */
  QUICK_TEST: 300,
  /** 1 hour - for longer test sessions */
  HOUR: 3600,
  /** 24 hours - default, good for CI/CD */
  DAY: 86400,
  /** 1 week - maximum allowed */
  WEEK: 604800,
} as const;

/**
 * Creates a temporary user for E2E testing.
 *
 * The user will be automatically deleted after the specified TTL.
 * This enables real E2E testing without polluting the database.
 *
 * @example
 * ```ts
 * const tempUser = await createTemporaryUser({
 *   email: `test-${Date.now()}@test.local`,
 *   password: 'SecurePass123!',
 * });
 *
 * // Use accessToken for authenticated requests
 * await page.evaluate((token) => {
 *   localStorage.setItem('accessToken', token);
 * }, tempUser.accessToken);
 * ```
 */
export async function createTemporaryUser(
  request: CreateTemporaryUserRequest,
  options?: {
    /** API base URL (defaults to getApiBaseUrl()) */
    baseUrl?: string;
    /** Test API key for production environments */
    apiKey?: string;
  },
): Promise<TemporaryUserResponse> {
  const baseUrl = options?.baseUrl ?? getApiBaseUrl();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.apiKey) {
    headers['x-test-api-key'] = options.apiKey;
  }

  const response = await fetch(`${baseUrl}/v1/testing/users/temporary`, {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create temporary user: ${response.status} ${error}`);
  }

  return response.json();
}

/**
 * Creates a unique test email with timestamp and random suffix.
 *
 * @param prefix - Optional prefix for the email (default: 'e2e-test')
 * @returns A unique test email address
 *
 * @example
 * ```ts
 * const email = createTestEmail(); // e2e-test-1704067200000-1234@test.local
 * const email = createTestEmail('auth'); // auth-1704067200000-1234@test.local
 * ```
 */
export function createTestEmail(prefix = 'e2e-test'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}-${timestamp}-${random}@test.local`;
}

/**
 * Creates a temporary test user with sensible defaults.
 *
 * Convenience wrapper around createTemporaryUser with auto-generated credentials.
 *
 * @param options - Optional overrides for user creation
 * @returns Created user with tokens
 *
 * @example
 * ```ts
 * // Quick test user (5 min TTL)
 * const user = await createQuickTestUser();
 *
 * // Custom TTL
 * const user = await createQuickTestUser({ ttlSeconds: TTL.HOUR });
 *
 * // Custom email prefix
 * const user = await createQuickTestUser({ emailPrefix: 'signup-test' });
 * ```
 */
export async function createQuickTestUser(options?: {
  emailPrefix?: string;
  password?: string;
  name?: string;
  ttlSeconds?: number;
  baseUrl?: string;
  apiKey?: string;
}): Promise<TemporaryUserResponse> {
  const email = createTestEmail(options?.emailPrefix);
  const password = options?.password ?? 'SecureTestPass123!';
  const name = options?.name ?? `Test User ${Date.now()}`;

  return createTemporaryUser(
    {
      email,
      password,
      name,
      ttlSeconds: options?.ttlSeconds ?? TTL.QUICK_TEST,
    },
    {
      baseUrl: options?.baseUrl,
      apiKey: options?.apiKey,
    },
  );
}

/**
 * Playwright-specific helper: Sets up an authenticated session.
 *
 * Stores the access token in localStorage so subsequent page loads
 * are authenticated.
 *
 * @param page - Playwright Page object
 * @param accessToken - Token from createTemporaryUser response
 *
 * @example
 * ```ts
 * const user = await createQuickTestUser();
 * await setupAuthenticatedSession(page, user.accessToken);
 * await page.goto('/dashboard'); // Will be authenticated
 * ```
 */
export async function setupAuthenticatedSession(
  page: {
    evaluate: (fn: (token: string) => void, arg: string) => Promise<void>;
  },
  accessToken: string,
): Promise<void> {
  await page.evaluate((token: string) => {
    localStorage.setItem('accessToken', token);
  }, accessToken);
}

/**
 * Manually triggers cleanup of expired temporary users.
 *
 * This is automatically done by the server on a cron schedule,
 * but can be triggered manually for testing.
 *
 * @param options - API configuration
 * @returns Cleanup result with deleted count
 */
export async function cleanupExpiredUsers(options?: {
  baseUrl?: string;
  apiKey?: string;
}): Promise<{ deletedCount: number }> {
  const baseUrl = options?.baseUrl ?? getApiBaseUrl();
  const headers: Record<string, string> = {};

  if (options?.apiKey) {
    headers['x-test-api-key'] = options.apiKey;
  }

  const response = await fetch(`${baseUrl}/v1/testing/users/expired`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to cleanup expired users: ${response.status} ${error}`);
  }

  return response.json();
}
