/**
 * Tech Skills Feature
 * Pre-populated tech skills catalog from GitHub Linguist + Stack Overflow
 */

// Types
export type {
  TechAreaType,
  SkillType,
  TechAreaDto,
  TechNicheDto,
  TechSkillDto,
  ProgrammingLanguageDto,
  TechSkillsSearchResult,
  TechSkillDisplayItem,
} from "./types";

// Services
export { techSkillsRepository } from "./services";

// Hooks
export {
  techSkillsKeys,
  useTechAreas,
  useTechNiches,
  useTechNichesByArea,
  useProgrammingLanguages,
  useSearchLanguages,
  useTechSkills,
  useSearchTechSkills,
  useSkillsByNiche,
  useSkillsByType,
  useSearchAllTechSkills,
} from "./hooks";

// Components
export { TechSkillAutocomplete } from "./components";
export type { TechSkillAutocompleteProps } from "./components";
