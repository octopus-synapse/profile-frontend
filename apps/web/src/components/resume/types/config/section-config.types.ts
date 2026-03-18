/**
 * Section Configuration
 * Per-section visibility, ordering, and styling
 *
 * NOTE: Section keys are now dynamic (from backend SectionType).
 * Use string keys like 'work_experience_v1', 'education_v1', etc.
 */

import type { ColumnPosition } from './layout.types';

/**
 * Configuration for a single section
 * @param key - The section type key (e.g., 'work_experience_v1')
 */
export interface SectionConfig {
  key: string;
  visible: boolean;
  order: number;
  column: ColumnPosition;
  customTitle?: string;
  style?: Record<string, unknown>;
}

/**
 * Override for a specific item within a list section
 * Allows hiding/reordering individual items (experiences, skills, etc.)
 */
export interface ItemOverride {
  itemId: string;
  visible: boolean;
  order: number;
  customLabel?: string;
}

/**
 * Per-section item overrides
 * Maps section key to array of item overrides
 */
export type SectionItemOverrides = Record<string, ItemOverride[] | undefined>;

/**
 * Complete section configuration including item overrides
 */
export interface FullSectionConfig extends SectionConfig {
  itemOverrides?: ItemOverride[];
}
