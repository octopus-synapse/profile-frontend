/**
 * Test Render Helper
 * Uncle Bob: "Tests should be simple and explicit"
 *
 * Provides a custom render function that wraps components
 * with the necessary providers for testing.
 */

import { render as rtlRender, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import type { ReactElement, ReactNode } from "react";
import type { Session } from "next-auth";

/**
 * Options for renderWithProviders
 */
interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  /**
   * Optional session to provide to SessionProvider
   * Default: null (unauthenticated)
   */
  session?: Session | null;

  /**
   * Optional QueryClient instance
   * Default: creates a new QueryClient with test-friendly defaults
   */
  queryClient?: QueryClient;
}

/**
 * Creates a QueryClient optimized for testing
 * Uncle Bob: "Configuration should be explicit"
 */
function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Disable automatic refetching in tests
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
    // Suppress errors in tests
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // Suppress error logs
    },
  });
}

/**
 * Wrapper component with all necessary providers
 */
function AllTheProviders({
  children,
  session = null,
  queryClient,
}: {
  children: ReactNode;
  session?: Session | null;
  queryClient: QueryClient;
}) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}

/**
 * Custom render function that wraps components with providers
 *
 * @example
 * ```tsx
 * // Unauthenticated test
 * const { getByText } = renderWithProviders(<MyComponent />);
 *
 * // Authenticated test
 * const session = createMockSession({ userId: '123' });
 * const { getByText } = renderWithProviders(<MyComponent />, { session });
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    session = null,
    queryClient,
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) {
  // Create a fresh QueryClient for each test to ensure isolation
  const testQueryClient = queryClient ?? createTestQueryClient();

  const Wrapper = ({ children }: { children: ReactNode }) => {
    return (
      <AllTheProviders session={session} queryClient={testQueryClient}>
        {children}
      </AllTheProviders>
    );
  };

  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient: testQueryClient,
  };
}

/**
 * Re-export everything from @testing-library/react
 * This allows tests to import everything from one place
 */
export * from "@testing-library/react";

/**
 * Override the default render with our custom one
 * Uncle Bob: "Make the right thing easy to do"
 */
export { renderWithProviders as render };
