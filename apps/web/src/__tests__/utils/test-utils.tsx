/**
 * Test Utilities
 * Shared utilities for testing React components with Bun Test
 */

import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

/**
 * Create a test QueryClient with default options
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Render component with all necessary providers
 */
interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
  locale?: string;
}

export function renderWithProviders(
  ui: ReactNode,
  {
    queryClient = createTestQueryClient(),
    locale: _locale = "en",
    ...options
  }: RenderWithProvidersOptions = {}
) {
  void _locale;

  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Wait for async operations to complete
 */
export function waitForAsync() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Create mock session for NextAuth
 */
export function createMockSession(overrides = {}) {
  return {
    user: {
      id: "test-user-id",
      email: "test@example.com",
      name: "Test User",
      role: "USER" as const,
      username: "testuser",
      hasCompletedOnboarding: false,
      image: null,
    },
    accessToken: "mock-access-token",
    expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    ...overrides,
  };
}

/**
 * Create mock user
 */
export function createMockUser(overrides = {}) {
  return {
    id: "test-user-id",
    email: "test@example.com",
    name: "Test User",
    role: "USER" as const,
    username: "testuser",
    hasCompletedOnboarding: false,
    image: null,
    ...overrides,
  };
}

// Re-export everything from testing-library
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
