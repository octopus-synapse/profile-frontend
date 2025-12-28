"use client";

/**
 * Resume Queries
 */

import { useQuery } from "@tanstack/react-query";
import { resumeRepository } from "../services/resume-repository";
import { resumeKeys } from "./query-keys";

/**
 * Get all resumes for current user
 */
export function useResumes() {
  return useQuery({
    queryKey: resumeKeys.list(),
    queryFn: () => resumeRepository.getAll(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Get single resume by ID
 */
export function useResume(id: string) {
  return useQuery({
    queryKey: resumeKeys.detail(id),
    queryFn: () => resumeRepository.getById(id),
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
    queryFn: () => resumeRepository.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
