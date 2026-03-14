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
  displayName: string;
  icon?: string;
  isActive: boolean;
  maxItems: number | null;
  definition: {
    kind: string;
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
// API Response Types
// ============================================================================

interface SectionTypesResponse {
  success: boolean;
  data: {
    sectionTypes: SectionType[];
  };
}

interface ResumeSectionsResponse {
  success: boolean;
  data: {
    sections: ResumeSection[];
  };
}

interface SectionItemResponse {
  success: boolean;
  data: {
    item: SectionItem;
  };
}

// ============================================================================
// Resume ID Cache
// ============================================================================

interface Resume {
  id: string;
  title: string;
  userId: string;
}

let cachedResumeId: string | null = null;

async function getResumeId(): Promise<string> {
  if (cachedResumeId) return cachedResumeId;

  const resumes = await httpClient.get<Resume[]>('/resumes');

  if (!resumes || resumes.length === 0) {
    const newResume = await httpClient.post<Resume>('/resumes', { title: 'My Resume' });
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
    const response = await httpClient.get<SectionTypesResponse>(
      `/v1/resumes/${resumeId}/sections/types`,
    );
    return response.data.sectionTypes;
  },

  /** List all sections with items for a resume */
  async getAllSections(resumeId?: string): Promise<ResumeSection[]> {
    const id = resumeId || (await getResumeId());
    const response = await httpClient.get<ResumeSectionsResponse>(`/v1/resumes/${id}/sections`);
    return response.data.sections;
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
    const response = await httpClient.post<SectionItemResponse>(
      `/v1/resumes/${id}/sections/${sectionTypeKey}/items`,
      { content },
    );
    return response.data.item;
  },

  /** Update a section item */
  async updateItem(
    sectionTypeKey: string,
    itemId: string,
    content: Record<string, unknown>,
    resumeId?: string,
  ): Promise<SectionItem> {
    const id = resumeId || (await getResumeId());
    const response = await httpClient.patch<SectionItemResponse>(
      `/v1/resumes/${id}/sections/${sectionTypeKey}/items/${itemId}`,
      { content },
    );
    return response.data.item;
  },

  /** Delete a section item */
  async deleteItem(sectionTypeKey: string, itemId: string, resumeId?: string): Promise<void> {
    const id = resumeId || (await getResumeId());
    await httpClient.delete(`/v1/resumes/${id}/sections/${sectionTypeKey}/items/${itemId}`);
  },
};
