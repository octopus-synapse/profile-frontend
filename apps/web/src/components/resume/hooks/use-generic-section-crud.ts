/**
 * Generic Section CRUD Hook
 *
 * Provides unified CRUD operations for any section type using the generic sections API.
 * This replaces section-specific hooks (useExperiences, useEducation, etc.)
 *
 * NOTE: Uses direct API calls because orval doesn't generate body params for mutations.
 * Will migrate to pure SDK once backend swagger spec is updated.
 */

'use client';

import {
  getGenericResumeSectionsListResumeSectionsQueryKey,
  useGenericResumeSectionsListResumeSections,
  useGenericResumeSectionsListTypes,
} from '@profile/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  ResumeSection,
  SectionItem,
  SectionTypeMetadata,
} from '../types/generic-section.types';
import {
  parseResumeSection,
  parseSectionItem,
  parseSectionTypeMetadata,
} from '../types/generic-section.types';

interface GenericSectionContent {
  [key: string]: string | number | boolean | null | string[] | undefined;
}

interface UseGenericSectionCRUDOptions {
  /** Resume ID to operate on */
  resumeId: string;
  /** Section type key (e.g., 'work_experience_v1', 'education_v1') */
  sectionTypeKey: string;
  /** Whether to enable queries (default: true) */
  enabled?: boolean;
}

interface UseGenericSectionCRUDResult {
  /** Section items */
  items: SectionItem[];
  /** Full section data including metadata */
  section: ResumeSection | undefined;
  /** Section type metadata */
  sectionType: SectionTypeMetadata | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Create a new item */
  createItem: (content: GenericSectionContent) => Promise<SectionItem>;
  /** Update an existing item */
  updateItem: (itemId: string, content: GenericSectionContent) => Promise<SectionItem>;
  /** Delete an item */
  deleteItem: (itemId: string) => Promise<void>;
  /** Mutation states */
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

/**
 * Query key factory for generic sections
 */
export const genericSectionKeys = {
  all: ['generic-sections'] as const,
  types: (resumeId: string) => [...genericSectionKeys.all, 'types', resumeId] as const,
  sections: (resumeId: string) => [...genericSectionKeys.all, 'sections', resumeId] as const,
  section: (resumeId: string, sectionTypeKey: string) =>
    [...genericSectionKeys.all, 'section', resumeId, sectionTypeKey] as const,
};

/**
 * Direct API helper (temporary until SDK is updated)
 */
async function apiRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `API Error: ${res.status}`);
  }

  return res.json();
}

export function useGenericSectionCRUD({
  resumeId,
  sectionTypeKey,
  enabled = true,
}: UseGenericSectionCRUDOptions): UseGenericSectionCRUDResult {
  const queryClient = useQueryClient();

  // Fetch section types to get metadata
  const typesQuery = useGenericResumeSectionsListTypes(resumeId, {
    query: {
      enabled: enabled && !!resumeId,
      staleTime: 5 * 60 * 1000, // Types rarely change
    },
  });

  // Fetch all sections for the resume
  const sectionsQuery = useGenericResumeSectionsListResumeSections(resumeId, {
    query: {
      enabled: enabled && !!resumeId,
      staleTime: 30 * 1000, // Sections can change more frequently
    },
  });

  // Parse section types from raw API response
  // Response shape: { data: { data: { sectionTypes: [...] } }, status, headers }
  const typesData = typesQuery.data?.data?.data;
  const sectionTypes = (typesData?.sectionTypes ?? []).map((raw: Record<string, unknown>) =>
    parseSectionTypeMetadata(raw),
  );

  // Find the specific section type metadata
  const sectionType = sectionTypes.find((st: SectionTypeMetadata) => st.key === sectionTypeKey);

  // Parse sections from raw API response
  const sectionsData = sectionsQuery.data?.data?.data;
  const sections = (sectionsData?.sections ?? []).map((raw: Record<string, unknown>) =>
    parseResumeSection(raw),
  );

  // Find section for this type
  const section = sections.find((s: ResumeSection) => s.sectionTypeKey === sectionTypeKey);
  const items = section?.items ?? [];

  // Invalidation helper
  const invalidateSections = () => {
    return queryClient.invalidateQueries({
      queryKey: getGenericResumeSectionsListResumeSectionsQueryKey(resumeId),
    });
  };

  // Create mutation (direct API until SDK updated)
  const createMutation = useMutation({
    mutationFn: async (content: GenericSectionContent) => {
      const response = await apiRequest<{ data: { item: Record<string, unknown> } }>(
        'POST',
        `/v1/resumes/${resumeId}/sections/${sectionTypeKey}/items`,
        { content },
      );
      return parseSectionItem(response.data.item);
    },
    onSuccess: () => {
      void invalidateSections();
    },
  });

  // Update mutation (direct API until SDK updated)
  const updateMutation = useMutation({
    mutationFn: async ({ itemId, content }: { itemId: string; content: GenericSectionContent }) => {
      const response = await apiRequest<{ data: { item: Record<string, unknown> } }>(
        'PATCH',
        `/v1/resumes/${resumeId}/sections/${sectionTypeKey}/items/${itemId}`,
        { content },
      );
      return parseSectionItem(response.data.item);
    },
    onSuccess: () => {
      void invalidateSections();
    },
  });

  // Delete mutation (direct API until SDK updated)
  const deleteMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await apiRequest<{ success: boolean }>(
        'DELETE',
        `/v1/resumes/${resumeId}/sections/${sectionTypeKey}/items/${itemId}`,
      );
    },
    onSuccess: () => {
      void invalidateSections();
    },
  });

  // CRUD operations
  const createItem = async (content: GenericSectionContent) => {
    return createMutation.mutateAsync(content);
  };

  const updateItem = async (itemId: string, content: GenericSectionContent) => {
    return updateMutation.mutateAsync({ itemId, content });
  };

  const deleteItem = async (itemId: string) => {
    await deleteMutation.mutateAsync(itemId);
  };

  return {
    items,
    section,
    sectionType,
    isLoading: typesQuery.isLoading || sectionsQuery.isLoading,
    error: (typesQuery.error ?? sectionsQuery.error) as Error | null,
    createItem,
    updateItem,
    deleteItem,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
