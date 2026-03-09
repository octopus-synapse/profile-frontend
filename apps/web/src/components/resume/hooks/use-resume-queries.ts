"use client";

/**
 * Resume Queries
 *
 * Uses @profile/api-client for all API calls.
 * This ensures web and mobile share the same implementation.
 */

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { resumeKeys } from "./query-keys";

/**
 * Get all resumes for current user
 */
export function useResumes() {
  return useQuery({
    queryKey: resumeKeys.list(),
    queryFn: () => apiClient.resumes.getAll(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Get single resume by ID
 */
export function useResume(id: string) {
  return useQuery({
    queryKey: resumeKeys.detail(id),
    queryFn: () => apiClient.resumes.getById(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Get public resume by slug
 */
export function usePublicResume(slug: string) {
  return useQuery({
    queryKey: resumeKeys.public(slug),
    queryFn: () => apiClient.resumes.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
