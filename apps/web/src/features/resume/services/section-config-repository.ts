/**
 * Section Config Repository
 * Re-exports from @profile/api-client for consistency
 * 
 * @deprecated Use `apiClient.sectionConfig` from "@/shared/lib/api-client" directly
 */

import { apiClient } from "@/shared/lib/api-client";

/**
 * @deprecated Use `apiClient.sectionConfig` directly instead
 * @example
 * ```ts
 * import { apiClient } from "@/shared/lib/api-client";
 * await apiClient.sectionConfig.toggleSection(resumeId, sectionId, visible);
 * ```
 */
export const sectionConfigRepository = apiClient.sectionConfig;
