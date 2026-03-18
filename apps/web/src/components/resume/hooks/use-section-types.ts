/**
 * Hook: useSectionTypes
 *
 * Fetches section type definitions from backend.
 * Returns metadata about available section types including:
 * - key: unique identifier (e.g., "work_experience_v1")
 * - semanticKind: semantic category (e.g., "WORK_EXPERIENCE")
 * - title: display name
 * - renderHints: layout hints from backend Style DSL
 * - fieldStyles: per-field style hints from backend Style DSL
 *
 * This is used by generic section components to understand
 * what sections are available and how to render them.
 */

'use client';

import { useResumesListTypes } from '@profile/api-client';
import type { FieldStyles, RenderHints } from '../utils/style-dsl-interpreter';

/**
 * Section type metadata from backend
 * Includes Style DSL fields for dynamic rendering
 */
export interface SectionTypeMeta {
  key: string;
  semanticKind: string;
  title: string;
  definition?: Record<string, unknown>;
  renderHints?: RenderHints;
  fieldStyles?: FieldStyles;
  iconType?: string;
  icon?: string;
}

interface UseSectionTypesResult {
  sectionTypes: SectionTypeMeta[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Fetch section types for a resume
 *
 * @param resumeId - Resume ID to fetch section types for
 * @returns Section types, loading state, and error
 *
 * @example
 * ```tsx
 * const { sectionTypes, isLoading } = useSectionTypes(resumeId);
 *
 * if (isLoading) return <Spinner />;
 *
 * return (
 *   <div>
 *     {sectionTypes.map(type => (
 *       <div key={type.key}>{type.title}</div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useSectionTypes(resumeId: string): UseSectionTypesResult {
  const { data, isLoading, error, refetch } = useResumesListTypes(resumeId, undefined, {
    query: {
      enabled: !!resumeId,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    },
  });

  // Extract section types from response
  // Response shape: { data: { sectionTypes: [...] }, status, headers }
  const sectionTypes: SectionTypeMeta[] = [];
  const typesData = data?.data;

  if (typesData?.sectionTypes) {
    for (const key of typesData.sectionTypes) {
      // The API now returns just section type keys as strings
      // We create minimal metadata from the key
      sectionTypes.push({
        key: key,
        semanticKind: key.toUpperCase().replace(/_V\d+$/, ''),
        title: key
          .replace(/_v\d+$/, '')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        definition: undefined,
        renderHints: undefined,
        fieldStyles: undefined,
        iconType: undefined,
        icon: undefined,
      });
    }
  }

  return {
    sectionTypes,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}

/**
 * Get a section type by key
 */
export function getSectionTypeByKey(
  sectionTypes: SectionTypeMeta[],
  key: string,
): SectionTypeMeta | undefined {
  return sectionTypes.find((st) => st.key === key);
}

/**
 * Get section types by semantic kind
 */
export function getSectionTypesByKind(
  sectionTypes: SectionTypeMeta[],
  semanticKind: string,
): SectionTypeMeta[] {
  return sectionTypes.filter((st) => st.semanticKind === semanticKind);
}
