/**
 * User Repository
 * Re-exports from @profile/api-client for consistency
 * 
 * @deprecated Use `apiClient.users` from "@/shared/lib/api-client" directly
 */

import { apiClient } from "@/shared/lib/api-client";

// Re-export types from api-client for backward compatibility
export type {
  User,
  UserProfile,
  UpdateUserDto,
  UserStats,
  AdminUserListItem,
  AdminUserFilters,
  PaginatedUsers,
} from "@profile/api-client";

/**
 * @deprecated Use `apiClient.users` directly instead
 * @example
 * ```ts
 * import { apiClient } from "@/shared/lib/api-client";
 * const user = await apiClient.users.getMe();
 * ```
 */
export const userRepository = apiClient.users;
