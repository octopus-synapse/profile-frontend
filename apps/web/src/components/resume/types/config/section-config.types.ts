/**
 * Section Configuration
 * Per-section visibility, ordering, and styling
 */

import type { ColumnPosition } from "./layout.types";
import type { SectionId, ListSectionId } from "./section-ids.types";
import type { SectionStyleMap } from "./section-styles.types";

/**
 * Configuration for a single section
 */
export interface SectionConfig<T extends SectionId = SectionId> {
  id: T;
  visible: boolean;
  order: number;
  column: ColumnPosition;
  customTitle?: string;
  style: T extends keyof SectionStyleMap ? Partial<SectionStyleMap[T]> : object;
}

/**
 * Override for a specific item within a list section
 * Allows hiding/reordering individual items (experiences, skills, etc.)
 */
export interface ItemOverride {
  itemId: string; // ID from database
  visible: boolean; // Can hide specific items
  order: number; // Custom order (overrides default)
  customLabel?: string; // Override display name
}

/**
 * Per-section item overrides
 * Maps section ID to array of item overrides
 */
export type SectionItemOverrides = {
  [K in ListSectionId]?: ItemOverride[];
};

/**
 * Complete section configuration including item overrides
 */
export interface FullSectionConfig<T extends SectionId = SectionId> extends SectionConfig<T> {
  itemOverrides?: T extends ListSectionId ? ItemOverride[] : never;
}
