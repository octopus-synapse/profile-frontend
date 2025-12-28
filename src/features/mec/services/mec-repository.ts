/**
 * MEC API Repository
 * Service for fetching MEC data from backend
 */

import { httpClient } from "@/shared/lib";
import type {
  MecInstitution,
  MecCourse,
  MecInstitutionSearchResult,
  MecCourseSearchResult,
} from "../types";

const BASE_URL = "/mec";

/**
 * Search institutions by name or acronym
 */
export async function searchInstitutions(
  query: string,
  limit = 20
): Promise<MecInstitutionSearchResult> {
  if (!query || query.length < 2) {
    return { total: 0, data: [] };
  }

  const data = await httpClient.get<MecInstitution[]>(`${BASE_URL}/institutions/search`, {
    params: { q: query, limit },
  });

  return {
    total: data.length,
    data,
  };
}

/**
 * Search courses by name
 */
export async function searchCourses(query: string, limit = 20): Promise<MecCourseSearchResult> {
  if (!query || query.length < 2) {
    return { total: 0, data: [] };
  }

  const data = await httpClient.get<MecCourse[]>(`${BASE_URL}/courses/search`, {
    params: { q: query, limit },
  });

  return {
    total: data.length,
    data,
  };
}

/**
 * Get courses by institution code
 */
export async function getCoursesByInstitution(codigoIes: number): Promise<MecCourse[]> {
  return httpClient.get<MecCourse[]>(`${BASE_URL}/institutions/${codigoIes}/courses`);
}

/**
 * Get institution by code
 */
export async function getInstitutionByCode(codigoIes: number): Promise<MecInstitution | null> {
  try {
    return await httpClient.get<MecInstitution>(`${BASE_URL}/institutions/${codigoIes}`);
  } catch {
    return null;
  }
}

/**
 * Get all UFs (states)
 */
export async function getUfs(): Promise<string[]> {
  return httpClient.get<string[]>(`${BASE_URL}/ufs`);
}

/**
 * Get all academic areas
 */
export async function getAreas(): Promise<string[]> {
  return httpClient.get<string[]>(`${BASE_URL}/areas`);
}
