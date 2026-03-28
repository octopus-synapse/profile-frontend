/**
 * Types for public profile resume rendering.
 */

export type FieldStyleSemantic =
  | 'title'
  | 'subtitle'
  | 'date'
  | 'dateRange'
  | 'description'
  | 'chip'
  | 'badge'
  | 'location'
  | 'link'
  | 'email'
  | 'phone'
  | 'hidden';

export type FieldStyleMap = Record<string, { semantic?: FieldStyleSemantic; order?: number }>;

export interface RenderHints {
  layout?: 'timeline' | 'list' | 'grid' | 'cards' | 'compact';
  columns?: number;
  showDividers?: boolean;
}
