/**
 * SearchConstants — shared constants for search functionality.
 */

export const DEBOUNCE_MS = 350;

export const SORT_OPTIONS = [
  { value: 'relevance', labelKey: 'social.search.sortRelevance' },
  { value: 'recent', labelKey: 'social.search.sortRecent' },
  { value: 'experience', labelKey: 'social.search.sortExperience' },
] as const;

export const SKILL_CHIPS = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Java',
  'Go',
  'Rust',
  'DevOps',
] as const;
