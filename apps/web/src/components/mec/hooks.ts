'use client';

/**
 * MEC Hooks
 * Wrapper hooks for MEC API endpoints
 * These provide a simpler interface for searching courses and institutions
 */

import {
  selectEnvelopeData,
  useMecCoursesSearchCoursesByName,
  useMecInstitutionsListCoursesByInstitutionCode,
  useMecInstitutionsSearchInstitutionsByName,
} from '@profile/api-client';
import type { MecCourse, MecInstitution } from './types';

function selectCourses(response: { data: { data: unknown } }): MecCourse[] {
  return ((selectEnvelopeData(response) as { courses?: unknown })?.courses ??
    []) as unknown as MecCourse[];
}

function selectInstitutions(response: { data: { data: unknown } }): MecInstitution[] {
  return ((selectEnvelopeData(response) as { institutions?: unknown })?.institutions ??
    []) as unknown as MecInstitution[];
}

/**
 * Search courses by name
 * @param query - Search query (minimum 2 characters)
 * @param enabled - Whether the query is enabled
 */
export function useSearchCourses(query: string, enabled: boolean = true) {
  const result = useMecCoursesSearchCoursesByName(
    { q: query },
    {
      query: {
        enabled: enabled && query.length >= 2,
        staleTime: 1000 * 60 * 5, // 5 minutes
        select: selectCourses,
      },
    },
  );

  return {
    data: result.data
      ? {
          data: result.data,
        }
      : undefined,
    isLoading: result.isLoading,
    error: result.error,
  };
}

/**
 * Search institutions by name
 * @param query - Search query (minimum 2 characters)
 */
export function useSearchInstitutions(query: string) {
  const result = useMecInstitutionsSearchInstitutionsByName(
    { q: query },
    {
      query: {
        enabled: query.length >= 2,
        staleTime: 1000 * 60 * 5, // 5 minutes
        select: selectInstitutions,
      },
    },
  );

  return {
    data: result.data
      ? {
          data: result.data,
        }
      : undefined,
    isLoading: result.isLoading,
    error: result.error,
  };
}

/**
 * Get courses by institution code
 * @param institutionCode - Institution code (codigoIes)
 */
export function useCoursesByInstitution(institutionCode: number | null) {
  const result = useMecInstitutionsListCoursesByInstitutionCode(institutionCode ?? 0, {
    query: {
      enabled: institutionCode !== null && institutionCode > 0,
      staleTime: 1000 * 60 * 5, // 5 minutes
      select: selectCourses,
    },
  });

  return {
    data: result.data ?? [],
    isLoading: result.isLoading,
    error: result.error,
  };
}
