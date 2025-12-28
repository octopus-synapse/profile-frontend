/**
 * Theme Repository
 * Re-exports from @profile/api-client for consistency
 * 
 * @deprecated Use `apiClient.themes` from "@/shared/lib/api-client" directly
 */

import { apiClient } from "@/shared/lib/api-client";

// Re-export types from api-client for backward compatibility
export type {
  Theme,
  CreateThemeDto,
  UpdateThemeDto,
  ThemeQueryParams,
  ThemeStatus,
  ThemeCategory,
} from "@profile/api-client";

// Alias for backward compatibility
export type CreateThemeInput = import("@profile/api-client").CreateThemeDto;
export type UpdateThemeInput = import("@profile/api-client").UpdateThemeDto;

/**
 * @deprecated Use `apiClient.themes` directly instead
 * @example
 * ```ts
 * import { apiClient } from "@/shared/lib/api-client";
 * const themes = await apiClient.themes.getSystem();
 * ```
 */
export const themeRepository = apiClient.themes;
