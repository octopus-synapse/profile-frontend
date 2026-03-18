/**
 * E2E Test Setup
 *
 * Configuration for end-to-end tests against a real backend.
 * Backend must be running on the configured BASE_URL.
 *
 * Decision: Uses centralized routes from @profile/api-client for consistency
 * with the rest of the codebase.
 *
 * Usage:
 *   Start backend: cd ../profile-services && docker compose -f docker-compose.dev.yml up -d
 *   Run tests: bun test test/e2e/
 */

import { getBackendHost } from "../../packages/api-client/src/constants/routes";

/**
 * E2E Test Configuration
 */
export const E2E_CONFIG = {
 BASE_URL: process.env.E2E_BASE_URL ?? getBackendHost(),
 TIMEOUT: 30_000,
 TEST_USER: {
  email: `e2e-test-${Date.now()}@example.com`,
  password: "TestPassword123!",
  name: "E2E Test User",
 },
} as const;

/**
 * Custom fetch for E2E tests (bypasses SDK's internal config)
 */
export async function e2eFetch<T>(
 path: string,
 options?: RequestInit & { token?: string },
): Promise<{ data: T; status: number; headers: Headers }> {
 const { token, ...fetchOptions } = options ?? {};

 const headers = new Headers(fetchOptions.headers);
 headers.set("Content-Type", "application/json");
 headers.set("Accept", "application/json");
 // Prevent caching issues in tests
 headers.set("Cache-Control", "no-cache, no-store");

 if (token) {
  headers.set("Authorization", `Bearer ${token}`);
 }

 const url = `${E2E_CONFIG.BASE_URL}${path}`;
 console.log("[e2eFetch] URL:", url, "token:", token ? "yes" : "no");

 const response = await fetch(url, {
  ...fetchOptions,
  headers,
  cache: "no-store",
  credentials: "omit", // Explicitly omit cookies
 });
 
 console.log("[e2eFetch] Response status:", response.status);

 let data: T;
 if (
  response.status === 204 ||
  response.headers.get("content-length") === "0"
 ) {
  // No content responses
  data = undefined as T;
 } else {
  const text = await response.text();
  if (!text) {
   // Empty response body
   data = undefined as T;
  } else {
   const json = JSON.parse(text);
   // Backend wraps responses in { success: boolean, data: T }
   // Extract the data field if it exists
   data = json.data !== undefined ? json.data : json;
  }
 }

 return {
  data,
  status: response.status,
  headers: response.headers,
 };
}

/**
 * Check if backend is available
 */
export async function isBackendAvailable(): Promise<boolean> {
 try {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  // Health endpoint doesn't follow /api/v1 pattern
  const response = await fetch(`${E2E_CONFIG.BASE_URL}/api/health`, {
   signal: controller.signal,
  });

  clearTimeout(timeoutId);
  return response.ok;
 } catch {
  return false;
 }
}

/**
 * Re-export routes for E2E tests
 */
export {
 ACCOUNT_LIFECYCLE_ROUTES,
 ADMIN_SECTION_TYPES_ROUTES,
 AUTHENTICATION_ROUTES,
 ENUMS_ROUTES,
 RESUMES_ROUTES,
 THEMES_ROUTES,
 PLATFORM_ROUTES,
 TECH_AREAS_ROUTES,
 TECH_SKILLS_ROUTES,
 MEC_METADATA_ROUTES,
 ONBOARDING_ROUTES,
 USERS_ROUTES,
} from "../../packages/api-client/src/constants/routes";

/**
 * Skip test suite if backend is unavailable
 */
export async function skipIfBackendUnavailable(): Promise<void> {
 const available = await isBackendAvailable();
 if (!available) {
  throw new Error(
   `Backend not available at ${E2E_CONFIG.BASE_URL}. ` +
    "Start backend with: cd ../profile-services && docker compose -f docker-compose.dev.yml up -d",
  );
 }
}
