'use client';

/**
 * MEC Hooks
 * Wrapper hooks for MEC API endpoints
 * These provide a simpler interface for searching courses and institutions
 */

import {
  useMecCoursesSearchCoursesByName,
  useMecInstitutionsListCoursesByInstitutionCode,
  useMecInstitutionsSearchInstitutionsByName,
} from '@profile/api-client';
import type { MecCourse, MecInstitution } from './types';

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
      },
    },
  );

  return {
    data: result.data?.data?.courses
      ? {
          data: (result.data.data.courses ?? []) as unknown as MecCourse[],
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
      },
    },
  );

  return {
    data: result.data?.data?.institutions
      ? {
          data: (result.data.data.institutions ?? []) as unknown as MecInstitution[],
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
  const result = useMecInstitutionsListCoursesByInstitutionCode(String(institutionCode ?? 0), {
    query: {
      enabled: institutionCode !== null && institutionCode > 0,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  });

  return {
    data: (result.data?.data?.courses ?? []) as unknown as MecCourse[],
    isLoading: result.isLoading,
    error: result.error,
  };
}
