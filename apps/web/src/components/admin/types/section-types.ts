/**
 * Section Type Types for Admin Management.
 * Frontend UI types that mirror SDK SectionTypeDataDto structure.
 */

import type { FieldDefinition } from './field-definition';
import type { FieldStylesMap, RenderHints } from './style-config';

export interface SectionTypeTranslation {
  title?: string;
  label?: string;
  description?: string;
  noDataLabel?: string;
  placeholder?: string;
  addLabel?: string;
}

export interface SectionTypeData {
  id: string;
  key: string;
  slug: string;
  title: string;
  description?: string | null;
  semanticKind: string;
  version: number;
  isActive: boolean;
  isSystem: boolean;
  isRepeatable: boolean;
  minItems: number;
  maxItems?: number | null;
  definition: FieldDefinition;
  uiSchema?: Record<string, unknown>;
  renderHints: RenderHints;
  fieldStyles: FieldStylesMap;
  iconType: string;
  icon: string;
  translations: Record<string, SectionTypeTranslation>;
  createdAt: string;
  updatedAt: string;
}

export interface SectionTypeListParams {
  search?: string;
  semanticKind?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateSectionTypePayload {
  key: string;
  slug: string;
  title: string;
  description?: string;
  semanticKind: string;
  iconType: 'emoji' | 'lucide';
  icon: string;
  isRepeatable: boolean;
  minItems: number;
  maxItems?: number;
  definition: Record<string, unknown>;
  renderHints: Record<string, unknown>;
  fieldStyles: Record<string, unknown>;
  translations: Record<string, Partial<SectionTypeTranslation>>;
}

export interface UpdateSectionTypePayload {
  title: string;
  description?: string | null;
  isActive: boolean;
  isRepeatable: boolean;
  iconType: 'emoji' | 'lucide';
  icon: string;
  minItems: number;
  maxItems?: number | null;
  definition: Record<string, unknown>;
  renderHints: Record<string, unknown>;
  fieldStyles: Record<string, unknown>;
  translations: Record<string, Partial<SectionTypeTranslation>>;
}
