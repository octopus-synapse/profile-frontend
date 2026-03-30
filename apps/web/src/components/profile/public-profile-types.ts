/**
 * Frontend utility types for public profile rendering.
 * These are not SDK types - they define how the frontend interprets fieldStyles from the API.
 * The SDK types are generic ({[key: string]: unknown}) so we need to describe expected shapes.
 */

export type FieldStyleSemantic =
  | 'title'
  | 'subtitle'
  | 'description'
  | 'date'
  | 'dateRange'
  | 'location'
  | 'badge'
  | 'chip';

export interface FieldStyle {
  semantic?: FieldStyleSemantic;
  order?: number;
}

export type FieldStyleMap = Record<string, FieldStyle>;

export interface RenderHints {
  layout?: 'timeline' | 'card' | 'compact' | 'list';
  columns?: number;
}

/**
 * Expected shape of section data from the API.
 * SDK type is generic - this describes what frontend expects.
 */
export interface PublicProfileSection {
  id: string;
  sectionTypeKey: string;
  semanticKind?: string;
  items?: PublicProfileSectionItem[];
}

export interface PublicProfileSectionItem {
  id: string;
  content: Record<string, unknown> | string;
}
