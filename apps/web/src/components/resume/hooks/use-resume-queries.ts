'use client';

/**
 * Resume Queries
 *
 * Uses @profile/api-client SDK hooks directly.
 */

import {
  usePublicResumeGetPublicResume,
  useResumesGetAllUserResumes,
  useResumesGetResumeByIdForUser,
} from '@profile/api-client';
import { resumeKeys } from './query-keys';

/**
 * Get all resumes for current user
 */
export function useResumes() {
  return useResumesGetAllUserResumes(
    { page: 1, limit: 100 },
    {
      query: {
        queryKey: resumeKeys.list(),
        staleTime: 1 * 60 * 1000, // 1 minute
      },
    },
  );
}

/**
 * Get single resume by ID
 */
export function useResume(id: string) {
  return useResumesGetResumeByIdForUser(id, {
    query: {
      queryKey: resumeKeys.detail(id),
      enabled: !!id,
      staleTime: 30 * 1000, // 30 seconds
    },
  });
}

/**
 * Get public resume by slug
 */
export function usePublicResume(slug: string) {
  return usePublicResumeGetPublicResume(slug, {
    query: {
      queryKey: resumeKeys.public(slug),
      enabled: !!slug,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  });
}
