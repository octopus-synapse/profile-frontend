/**
 * Tech Skills Feature
 * Pre-populated tech skills catalog from GitHub Linguist + Stack Overflow
 */

export type { TechSkillAutocompleteProps } from './components';
// Components
export { TechSkillAutocomplete } from './components';

// Hooks
export {
  techSkillsKeys,
  useProgrammingLanguages,
  useSearchAllTechSkills,
  useSearchLanguages,
  useSearchTechSkills,
  useSkillsByNiche,
  useSkillsByType,
  useTechAreas,
  useTechNiches,
  useTechNichesByArea,
  useTechSkills,
} from './hooks';
// Services
export { techSkillsRepository } from './services';
// Types
export type {
  ProgrammingLanguageDto,
  SkillType,
  TechAreaDto,
  TechAreaType,
  TechNicheDto,
  TechSkillDisplayItem,
  TechSkillDto,
  TechSkillsSearchResult,
} from './types';
