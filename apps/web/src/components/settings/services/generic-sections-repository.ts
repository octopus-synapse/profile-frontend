/**
 * Generic Sections Repository
 *
 * Backend-driven section management. ZERO hardcoded section types.
 * All section types, fields, and items come from backend.
 *
 * Backend API:
 * - GET /v1/resumes/:resumeId/sections/types - List section types
 * - GET /v1/resumes/:resumeId/sections - List all sections
 * - POST /v1/resumes/:resumeId/sections/:sectionTypeKey/items - Create item
 * - PATCH /v1/resumes/:resumeId/sections/:sectionTypeKey/items/:itemId - Update item
 * - DELETE /v1/resumes/:resumeId/sections/:sectionTypeKey/items/:itemId - Delete item
 */

import { httpClient } from '@/shared/lib/http-client';

// ============================================================================
// Generic Section Types (from backend)
// ============================================================================

export interface SectionType {
  id: string;
  key: string;
  semanticKind: string;
  title: string; // Backend returns `title`, not `displayName`
  label?: string; // Resolved translation label
  description?: string;
  icon?: string;
  iconType?: string;
  isActive: boolean;
  isRepeatable?: boolean;
  minItems?: number;
  maxItems: number | null;
  definition: {
    kind?: string;
    fields: FieldDefinition[];
  } | null;
}

export interface FieldDefinition {
  key: string;
  label: string;
  type: 'string' | 'text' | 'date' | 'number' | 'boolean' | 'enum' | 'array' | 'object';
  required: boolean;
  placeholder?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  semanticRole?: string;
  options?: string[];
  enumValues?: string[];
  order: number;
}

export interface SectionItem {
  id: string;
  content: Record<string, unknown>;
  order: number;
  resumeSectionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeSection {
  id: string;
  sectionTypeKey: string;
  semanticKind: string;
  sectionType: SectionType | null;
  items: SectionItem[];
  order: number;
}

// ============================================================================
// API Response Types (after httpClient extracts .data from wrapper)
// ============================================================================

interface SectionTypesData {
  sectionTypes: SectionType[];
}

interface ResumeSectionsData {
  sections: ResumeSection[];
}

interface SectionItemData {
  item: SectionItem;
}

// ============================================================================
// Resume ID Cache
// ============================================================================

interface Resume {
  id: string;
  title: string;
}

interface ResumesListData {
  data: Resume[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

let cachedResumeId: string | null = null;

async function getResumeId(): Promise<string> {
  if (cachedResumeId) return cachedResumeId;

  const response = await httpClient.get<ResumesListData>('/api/v1/resumes');
  const resumes = response.data;

  if (!resumes || resumes.length === 0) {
    const newResume = await httpClient.post<Resume>('/api/v1/resumes', { title: 'My Resume' });
    cachedResumeId = newResume.id;
    return newResume.id;
  }

  const firstResume = resumes[0] as Resume;
  cachedResumeId = firstResume.id;
  return firstResume.id;
}

export function clearResumeCacheGeneric() {
  cachedResumeId = null;
}

// ============================================================================
// Generic Sections Repository
// ============================================================================

export const genericSectionsRepository = {
  /** List all available section types from backend */
  async getSectionTypes(): Promise<SectionType[]> {
    const resumeId = await getResumeId();
    const response = await httpClient.get<SectionTypesData>(
      `/api/v1/resumes/${resumeId}/sections/types`,
    );
    return response.sectionTypes;
  },

  /** List all sections with items for a resume */
  async getAllSections(resumeId?: string): Promise<ResumeSection[]> {
    const id = resumeId || (await getResumeId());
    const response = await httpClient.get<ResumeSectionsData>(`/api/v1/resumes/${id}/sections`);
    return response.sections;
  },

  /** Get items for a specific section type */
  async getSectionItems(sectionTypeKey: string, resumeId?: string): Promise<SectionItem[]> {
    const sections = await this.getAllSections(resumeId);
    const section = sections.find(
      (s) => s.sectionTypeKey === sectionTypeKey || s.sectionType?.key === sectionTypeKey,
    );
    return section?.items ?? [];
  },

  /** Create a section item */
  async createItem(
    sectionTypeKey: string,
    content: Record<string, unknown>,
    resumeId?: string,
  ): Promise<SectionItem> {
    const id = resumeId || (await getResumeId());
    const response = await httpClient.post<SectionItemData>(
      `/api/v1/resumes/${id}/sections/${sectionTypeKey}/items`,
      { content },
    );
    return response.item;
  },

  /** Update a section item */
  async updateItem(
    sectionTypeKey: string,
    itemId: string,
    content: Record<string, unknown>,
    resumeId?: string,
  ): Promise<SectionItem> {
    const id = resumeId || (await getResumeId());
    const response = await httpClient.patch<SectionItemData>(
      `/api/v1/resumes/${id}/sections/${sectionTypeKey}/items/${itemId}`,
      { content },
    );
    return response.item;
  },

  /** Delete a section item */
  async deleteItem(sectionTypeKey: string, itemId: string, resumeId?: string): Promise<void> {
    const id = resumeId || (await getResumeId());
    await httpClient.delete(`/api/v1/resumes/${id}/sections/${sectionTypeKey}/items/${itemId}`);
  },
};
