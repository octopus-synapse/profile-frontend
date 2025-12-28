/**
 * MEC React Query Hooks
 * Custom hooks for fetching MEC data with caching
 */

import { useQuery } from "@tanstack/react-query";
import {
  searchInstitutions,
  searchCourses,
  getCoursesByInstitution,
  getInstitutionByCode,
  getUfs,
  getAreas,
} from "../services/mec-repository";

// Query Keys
export const mecKeys = {
  all: ["mec"] as const,
  institutions: () => [...mecKeys.all, "institutions"] as const,
  institutionSearch: (query: string) => [...mecKeys.institutions(), "search", query] as const,
  institution: (code: number) => [...mecKeys.institutions(), "detail", code] as const,
  courses: () => [...mecKeys.all, "courses"] as const,
  courseSearch: (query: string) => [...mecKeys.courses(), "search", query] as const,
  coursesByInstitution: (codigoIes: number) =>
    [...mecKeys.courses(), "byInstitution", codigoIes] as const,
  ufs: () => [...mecKeys.all, "ufs"] as const,
  areas: () => [...mecKeys.all, "areas"] as const,
};

/**
 * Hook to search institutions by name or acronym
 */
export function useSearchInstitutions(query: string, enabled = true) {
  return useQuery({
    queryKey: mecKeys.institutionSearch(query),
    queryFn: () => searchInstitutions(query),
    enabled: enabled && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (garbage collection)
  });
}

/**
 * Hook to search courses by name
 */
export function useSearchCourses(query: string, enabled = true) {
  return useQuery({
    queryKey: mecKeys.courseSearch(query),
    queryFn: () => searchCourses(query),
    enabled: enabled && query.length >= 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Hook to get courses by institution code
 */
export function useCoursesByInstitution(codigoIes: number | null) {
  return useQuery({
    queryKey: mecKeys.coursesByInstitution(codigoIes!),
    queryFn: () => getCoursesByInstitution(codigoIes!),
    enabled: codigoIes !== null && codigoIes > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook to get institution by code
 */
export function useInstitution(codigoIes: number | null) {
  return useQuery({
    queryKey: mecKeys.institution(codigoIes!),
    queryFn: () => getInstitutionByCode(codigoIes!),
    enabled: codigoIes !== null && codigoIes > 0,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

/**
 * Hook to get all UFs (states)
 */
export function useUfs() {
  return useQuery({
    queryKey: mecKeys.ufs(),
    queryFn: getUfs,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

/**
 * Hook to get all academic areas
 */
export function useAreas() {
  return useQuery({
    queryKey: mecKeys.areas(),
    queryFn: getAreas,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
  });
}
