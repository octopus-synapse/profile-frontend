"use client";

/**
 * Resume Mutations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeRepository } from "../services/resume-repository";
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
} from "../types";

// ============================================================================
// Resume CRUD
// ============================================================================

export function useCreateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResumeDto) => resumeRepository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
}

export function useUpdateResume(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateResumeDto) => resumeRepository.update(resumeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resumeId: string) => resumeRepository.delete(resumeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
}

export function useDuplicateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resumeId: string) => resumeRepository.duplicate(resumeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
}

// ============================================================================
// Experience
// ============================================================================

export function useAddExperience(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExperienceDto) => resumeRepository.addExperience(resumeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
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
    }) => resumeRepository.updateExperience(resumeId, experienceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

export function useDeleteExperience(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (experienceId: string) => resumeRepository.deleteExperience(resumeId, experienceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

// ============================================================================
// Education
// ============================================================================

export function useAddEducation(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEducationDto) => resumeRepository.addEducation(resumeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
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
    }) => resumeRepository.updateEducation(resumeId, educationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

export function useDeleteEducation(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (educationId: string) => resumeRepository.deleteEducation(resumeId, educationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

// ============================================================================
// Skills
// ============================================================================

export function useAddSkill(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSkillDto) => resumeRepository.addSkill(resumeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

export function useBulkAddSkills(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skills: CreateSkillDto[]) => resumeRepository.bulkAddSkills(resumeId, skills),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

export function useDeleteSkill(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skillId: string) => resumeRepository.deleteSkill(resumeId, skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

// ============================================================================
// Languages
// ============================================================================

export function useAddLanguage(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLanguageDto) => resumeRepository.addLanguage(resumeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

export function useDeleteLanguage(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (languageId: string) => resumeRepository.deleteLanguage(resumeId, languageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

// ============================================================================
// Certifications
// ============================================================================

export function useAddCertification(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCertificationDto) => resumeRepository.addCertification(resumeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

export function useDeleteCertification(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (certificationId: string) =>
      resumeRepository.deleteCertification(resumeId, certificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

// ============================================================================
// Projects
// ============================================================================

export function useAddProject(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectDto) => resumeRepository.addProject(resumeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

export function useDeleteProject(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => resumeRepository.deleteProject(resumeId, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
    },
  });
}

// ============================================================================
// Export
// ============================================================================

export function useExportResumePDF() {
  return useMutation({
    mutationFn: (resumeId: string) => resumeRepository.exportPDF(resumeId),
  });
}

export function useExportResumeDOCX() {
  return useMutation({
    mutationFn: (resumeId: string) => resumeRepository.exportDOCX(resumeId),
  });
}
