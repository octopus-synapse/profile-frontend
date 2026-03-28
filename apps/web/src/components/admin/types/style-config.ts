'use client';

/**
 * Render Hints & Field Styles Types
 *
 * Typed representation matching backend Zod schemas.
 */

export type LayoutType = 'timeline' | 'list' | 'grid' | 'cards' | 'compact';
export type ItemLayout = 'horizontal' | 'vertical' | 'stacked';

export interface RenderHints {
  layout?: LayoutType;
  itemLayout?: ItemLayout;
  groupBy?: string;
  dateFormat?: string;
  showDividers?: boolean;
  columns?: number;
}

export type FieldSemantic =
  | 'title'
  | 'subtitle'
  | 'date'
  | 'dateRange'
  | 'link'
  | 'email'
  | 'phone'
  | 'location'
  | 'description'
  | 'chip'
  | 'badge'
  | 'hidden';

export type FieldWidget =
  | 'text'
  | 'textarea'
  | 'date'
  | 'dateRange'
  | 'select'
  | 'multiselect'
  | 'chips'
  | 'rating'
  | 'toggle'
  | 'url';

export type FieldWidth = 'full' | 'half' | 'third' | 'quarter' | 'auto';

export interface FieldStyleEntry {
  semantic?: FieldSemantic;
  widget?: FieldWidget;
  width?: FieldWidth;
  icon?: string;
  order?: number;
}

export type FieldStylesMap = Record<string, FieldStyleEntry>;

export const LAYOUTS: LayoutType[] = ['timeline', 'list', 'grid', 'cards', 'compact'];
export const ITEM_LAYOUTS: ItemLayout[] = ['horizontal', 'vertical', 'stacked'];
export const FIELD_SEMANTICS: FieldSemantic[] = [
  'title',
  'subtitle',
  'date',
  'dateRange',
  'link',
  'email',
  'phone',
  'location',
  'description',
  'chip',
  'badge',
  'hidden',
];
export const FIELD_WIDGETS: FieldWidget[] = [
  'text',
  'textarea',
  'date',
  'dateRange',
  'select',
  'multiselect',
  'chips',
  'rating',
  'toggle',
  'url',
];
export const FIELD_WIDTHS: FieldWidth[] = ['full', 'half', 'third', 'quarter', 'auto'];

export function parseRenderHints(raw: unknown): RenderHints {
  if (!raw || typeof raw !== 'object') return {};
  return raw as RenderHints;
}

export function parseFieldStyles(raw: unknown): FieldStylesMap {
  if (!raw || typeof raw !== 'object') return {};
  return raw as FieldStylesMap;
}
