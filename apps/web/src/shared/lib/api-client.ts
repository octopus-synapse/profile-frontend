/**
 * API Client Configuration
 * Next.js specific configuration for @profile/api-client
 */

import { createProfileApiClient, type ProfileApiClient } from "@profile/api-client";
import { getSession } from "next-auth/react";
import { API_URL } from "@/config/env";

// ============================================================================
// Singleton API Client Instance
// ============================================================================

let apiClientInstance: ProfileApiClient | null = null;

/**
 * Get or create the API client instance
 * Uses singleton pattern for client-side usage
 */
export function getApiClient(): ProfileApiClient {
  if (typeof window === "undefined") {
    // Server-side: always create new instance
    return createApiClient();
  }

  // Client-side: use singleton
  if (!apiClientInstance) {
    apiClientInstance = createApiClient();
  }

  return apiClientInstance;
}

/**
 * Create a new API client instance
 */
function createApiClient(): ProfileApiClient {
  return createProfileApiClient({
    baseURL: API_URL,
    timeout: 30000,
    getToken: async () => {
      const session = await getSession();
      return session?.accessToken ?? null;
    },
    onUnauthorized: () => {
      // Handle unauthorized - redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    },
  });
}

// ============================================================================
// Server-Side API Client
// ============================================================================

/**
 * Create API client for server-side usage with provided token
 * Use this in Server Components and Server Actions
 */
export function createServerApiClient(accessToken?: string | null): ProfileApiClient {
  return createProfileApiClient({
    baseURL: API_URL,
    timeout: 30000,
    getToken: () => accessToken ?? null,
  });
}

// ============================================================================
// Direct Export for Convenience
// ============================================================================

/**
 * Default API client instance
 * Use this for most client-side operations
 * 
 * @example
 * ```ts
 * import { apiClient } from "@/shared/lib/api-client";
 * 
 * // In a React Query hook
 * const { data } = useQuery({
 *   queryKey: ["user", "me"],
 *   queryFn: () => apiClient.users.getMe(),
 * });
 * 
 * // Direct usage
 * const resumes = await apiClient.resumes.getAll();
 * ```
 */
export const apiClient = new Proxy({} as ProfileApiClient, {
  get(_, prop) {
    return getApiClient()[prop as keyof ProfileApiClient];
  },
});

// Re-export types for convenience
export type { ProfileApiClient } from "@profile/api-client";
