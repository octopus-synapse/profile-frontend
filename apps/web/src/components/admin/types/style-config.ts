/**
 * Style Config Types for Admin Section Type Management.
 * Defines field styling and render hint options.
 */

export const FIELD_SEMANTICS = [
  'title',
  'subtitle',
  'description',
  'date',
  'dateRange',
  'location',
  'badge',
  'chip',
  'link',
  'image',
] as const;

export type FieldSemantic = (typeof FIELD_SEMANTICS)[number];

export const FIELD_WIDGETS = [
  'text',
  'textarea',
  'select',
  'checkbox',
  'date',
  'dateRange',
  'url',
  'email',
  'phone',
  'richtext',
  'hidden',
] as const;

export type FieldWidget = (typeof FIELD_WIDGETS)[number];

export const FIELD_WIDTHS = ['full', 'half', 'third', 'quarter'] as const;

export type FieldWidth = (typeof FIELD_WIDTHS)[number];

export const LAYOUTS = ['timeline', 'cards', 'grid', 'compact', 'list'] as const;

export type Layout = (typeof LAYOUTS)[number];
export type LayoutType = Layout;

export const ITEM_LAYOUTS = ['horizontal', 'vertical', 'card', 'inline'] as const;

export type ItemLayout = (typeof ITEM_LAYOUTS)[number];

export interface FieldStyleEntry {
  semantic?: FieldSemantic;
  widget?: FieldWidget;
  width?: FieldWidth;
  order?: number;
  hidden?: boolean;
}

export type FieldStylesMap = Record<string, FieldStyleEntry>;

export interface RenderHints {
  layout?: Layout;
  itemLayout?: ItemLayout;
  columns?: number;
  showBorder?: boolean;
  showDivider?: boolean;
  showDividers?: boolean;
  compact?: boolean;
  dateFormat?: string;
}

export function parseFieldStyles(data: unknown): FieldStylesMap {
  if (!data || typeof data !== 'object') return {};
  return data as FieldStylesMap;
}

export function parseRenderHints(data: unknown): RenderHints {
  if (!data || typeof data !== 'object') return {};
  return data as RenderHints;
}
