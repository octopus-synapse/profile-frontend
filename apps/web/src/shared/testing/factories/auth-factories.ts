/**
 * Auth Test Factories
 * Uncle Bob: "Tests should be deterministic and explicit"
 *
 * Simple factory functions for creating test data.
 * No randomization, no magic - just plain objects with sensible defaults.
 */

import type { Session } from "next-auth";

/**
 * Creates a mock session object for testing
 *
 * @example
 * ```tsx
 * const session = createMockSession();
 * const { getByText } = renderWithProviders(<MyComponent />, { session });
 * ```
 */
export function createMockSession(overrides?: Partial<Session>): Session {
  return {
    user: {
      id: "test-user-id",
      name: "Test User",
      email: "test@example.com",
      image: null,
      ...overrides?.user,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    ...overrides,
  };
}

/**
 * Creates a mock user object
 */
export function createMockUser(
  overrides?: Partial<Session["user"]>
): Session["user"] {
  return {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    image: null,
    ...overrides,
  };
}
