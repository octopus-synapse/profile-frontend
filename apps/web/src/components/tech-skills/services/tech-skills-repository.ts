/**
 * Tech Skills Repository
 * Re-exports from @profile/api-client for consistency
 * 
 * @deprecated Use `apiClient.techSkills` from "@/shared/lib/api-client" directly
 */

import { apiClient } from "@/shared/lib/api-client";

// Re-export types from api-client for backward compatibility
export type {
  TechArea,
  TechNiche,
  TechSkill,
  ProgrammingLanguage,
  TechSkillsSearchResult,
} from "@profile/api-client";

// Alias types for backward compatibility with old naming
export type TechAreaDto = import("@profile/api-client").TechArea;
export type TechNicheDto = import("@profile/api-client").TechNiche;
export type TechSkillDto = import("@profile/api-client").TechSkill;
export type ProgrammingLanguageDto = import("@profile/api-client").ProgrammingLanguage;

/**
 * @deprecated Use `apiClient.techSkills` directly instead
 * @example
 * ```ts
 * import { apiClient } from "@/shared/lib/api-client";
 * const areas = await apiClient.techSkills.getAreas();
 * ```
 */
export const techSkillsRepository = apiClient.techSkills;
