"use client";

/**
 * Resume Mutations
 *
 * Uses @profile/api-client for all API calls.
 * This ensures web and mobile share the same implementation.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { resumeKeys } from "./query-keys";
import type {
  CreateResumeDto,
  UpdateResumeDto,
  CreateExperienceDto,
  CreateEducationDto,
  CreateSkillDto,
  CreateLanguageDto,
  CreateCertificationDto,
  CreateProjectDto,
} from "./types";

// ============================================================================
// Resume CRUD
// ============================================================================

export function useCreateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResumeDto) => apiClient.resumes.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
}

export function useUpdateResume(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateResumeDto) => apiClient.resumes.update(resumeId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
      void queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resumeId: string) => apiClient.resumes.delete(resumeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
}

export function useDuplicateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resumeId: string) => apiClient.resumes.duplicate(resumeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
}

// ============================================================================
// Experience
// ============================================================================

export function useAddExperience(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExperienceDto) => apiClient.resumes.addExperience(resumeId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

export function useUpdateExperience(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      experienceId,
      data,
    }: {
      experienceId: string;
      data: Partial<CreateExperienceDto>;
    }) => apiClient.resumes.updateExperience(resumeId, experienceId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

export function useDeleteExperience(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (experienceId: string) => apiClient.resumes.deleteExperience(resumeId, experienceId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

// ============================================================================
// Education
// ============================================================================

export function useAddEducation(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEducationDto) => apiClient.resumes.addEducation(resumeId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

export function useUpdateEducation(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      educationId,
      data,
    }: {
      educationId: string;
      data: Partial<CreateEducationDto>;
    }) => apiClient.resumes.updateEducation(resumeId, educationId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

export function useDeleteEducation(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (educationId: string) => apiClient.resumes.deleteEducation(resumeId, educationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

// ============================================================================
// Skills
// ============================================================================

export function useAddSkill(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSkillDto) => apiClient.resumes.addSkill(resumeId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

export function useBulkAddSkills(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skills: CreateSkillDto[]) => apiClient.resumes.bulkAddSkills(resumeId, skills),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

export function useDeleteSkill(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skillId: string) => apiClient.resumes.deleteSkill(resumeId, skillId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

// ============================================================================
// Languages
// ============================================================================

export function useAddLanguage(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLanguageDto) => apiClient.resumes.addLanguage(resumeId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

export function useDeleteLanguage(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (languageId: string) => apiClient.resumes.deleteLanguage(resumeId, languageId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

// ============================================================================
// Certifications
// ============================================================================

export function useAddCertification(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCertificationDto) => apiClient.resumes.addCertification(resumeId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

export function useDeleteCertification(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (certificationId: string) =>
      apiClient.resumes.deleteCertification(resumeId, certificationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

// ============================================================================
// Projects
// ============================================================================

export function useAddProject(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectDto) => apiClient.resumes.addProject(resumeId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

export function useDeleteProject(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => apiClient.resumes.deleteProject(resumeId, projectId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

// ============================================================================
// Export
// ============================================================================

export function useExportResumePDF() {
  return useMutation({
    mutationFn: (resumeId: string) => apiClient.resumes.exportPDF(resumeId),
  });
}

export function useExportResumeDOCX() {
  return useMutation({
    mutationFn: (resumeId: string) => apiClient.resumes.exportDOCX(resumeId),
  });
}
