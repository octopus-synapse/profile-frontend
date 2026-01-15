/**
 * useApiClient Hook
 *
 * React hook to access the API client instance.
 * Clean Architecture: Application layer hook that provides
 * access to Infrastructure layer (api-client).
 */

"use client";

import { useMemo } from "react";
import { getApiClient } from "@/shared/lib/api-client";
import type { ProfileApiClient } from "@profile/api-client";

/**
 * Hook to get the API client instance
 *
 * @returns ProfileApiClient instance
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const apiClient = useApiClient();
 *
 *   const fetchData = async () => {
 *     const user = await apiClient.users.getMe();
 *     const status = await apiClient.consent.getConsentStatus();
 *   };
 *
 *   return <button onClick={fetchData}>Fetch</button>;
 * }
 * ```
 */
export function useApiClient(): ProfileApiClient {
  // Memoize to ensure stable reference
  const apiClient = useMemo(() => getApiClient(), []);
  return apiClient;
}
