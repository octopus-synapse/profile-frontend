/**
 * Test Mocks
 * Centralized mocks for external dependencies
 */

/**
 * Mock NextAuth
 */
export const mockNextAuth = {
  signIn: async () => ({ ok: true, error: null }),
  signOut: async () => {},
  useSession: () => ({
    data: null,
    status: "unauthenticated" as const,
  }),
};

/**
 * Mock Next.js Router
 */
export const mockRouter = {
  push: () => {},
  replace: () => {},
  refresh: () => {},
  back: () => {},
  forward: () => {},
  prefetch: () => Promise.resolve(),
  pathname: "/",
  query: {},
  asPath: "/",
};

/**
 * Mock HTTP Client
 */
export function createMockHttpClient() {
  return {
    get: async <T>(url: string): Promise<T> => {
      throw new Error(`Mock HTTP GET not implemented for ${url}`);
    },
    post: async <T>(url: string, _data?: unknown): Promise<T> => {
      void _data;
      throw new Error(`Mock HTTP POST not implemented for ${url}`);
    },
    patch: async <T>(url: string, _data?: unknown): Promise<T> => {
      void _data;
      throw new Error(`Mock HTTP PATCH not implemented for ${url}`);
    },
    put: async <T>(url: string, _data?: unknown): Promise<T> => {
      void _data;
      throw new Error(`Mock HTTP PUT not implemented for ${url}`);
    },
    delete: async <T>(url: string): Promise<T> => {
      throw new Error(`Mock HTTP DELETE not implemented for ${url}`);
    },
  };
}

/**
 * Mock API Error
 */
export function createMockApiError(status: number, message: string, code?: string) {
  return {
    response: {
      status,
      data: {
        success: false,
        error: {
          code: code || `ERROR_${status}`,
          message,
        },
      },
    },
    isAxiosError: true,
  };
}
