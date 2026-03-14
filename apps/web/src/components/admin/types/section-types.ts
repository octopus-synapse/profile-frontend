/**
 * Admin Section Types - Type Definitions
 *
 * Maps to the backend AdminSectionTypesController API contract.
 * All types derived from the Zod schemas in profile-contracts.
 */

export interface SectionTypeTranslation {
  title: string;
  description?: string;
  label: string;
  noDataLabel: string;
  placeholder: string;
  addLabel: string;
}

export interface SectionTypeData {
  key: string;
  slug: string;
  title: string;
  description: string | null;
  semanticKind: string;
  version: number;
  isActive: boolean;
  isSystem: boolean;
  isRepeatable: boolean;
  minItems: number;
  maxItems: number | null;
  definition: Record<string, unknown>;
  uiSchema: Record<string, unknown> | null;
  iconType: 'emoji' | 'lucide';
  icon: string;
  translations: Record<string, SectionTypeTranslation>;
  createdAt: string;
  updatedAt: string;
}

export interface SectionTypeListResponse {
  items: SectionTypeData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SectionTypeListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  semanticKind?: string;
}

export interface CreateSectionTypePayload {
  key: string;
  slug: string;
  title: string;
  description?: string;
  semanticKind: string;
  version?: number;
  isRepeatable?: boolean;
  minItems?: number;
  maxItems?: number;
  definition: Record<string, unknown>;
  uiSchema?: Record<string, unknown>;
  iconType?: 'emoji' | 'lucide';
  icon?: string;
  translations?: Record<string, Partial<SectionTypeTranslation>>;
}

export interface UpdateSectionTypePayload {
  slug?: string;
  title?: string;
  description?: string | null;
  isActive?: boolean;
  isRepeatable?: boolean;
  minItems?: number;
  maxItems?: number | null;
  definition?: Record<string, unknown>;
  uiSchema?: Record<string, unknown> | null;
  iconType?: 'emoji' | 'lucide';
  icon?: string;
  translations?: Record<string, Partial<SectionTypeTranslation>>;
}
