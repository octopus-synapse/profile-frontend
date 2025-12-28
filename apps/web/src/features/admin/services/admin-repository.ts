/**
 * Admin Repository
 * Re-exports from @profile/api-client for consistency
 * 
 * @deprecated Use `apiClient.admin` from "@/shared/lib/api-client" directly
 */

import { apiClient } from "@/shared/lib/api-client";

// Re-export types from api-client for backward compatibility
export type {
  AdminStats,
  AdminUser,
  RecentActivity,
  SystemHealth,
} from "@profile/api-client";

/**
 * @deprecated Use `apiClient.admin` directly instead
 * @example
 * ```ts
 * import { apiClient } from "@/shared/lib/api-client";
 * const stats = await apiClient.admin.getStats();
 * ```
 */
export const adminRepository = apiClient.admin;
