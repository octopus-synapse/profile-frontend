/**
 * Resume Repository
 * Handles all resume-related API calls
 */

import { httpClient } from "@/shared/lib/http-client";
import type {
  Resume,
  ResumeListItem,
  CreateResumeDto,
  UpdateResumeDto,
  Experience,
  CreateExperienceDto,
  Education,
  CreateEducationDto,
  Skill,
  CreateSkillDto,
  Language,
  CreateLanguageDto,
  Certification,
  CreateCertificationDto,
  Project,
  CreateProjectDto,
} from "../types";

const BASE_URL = "/resumes";

export const resumeRepository = {
  // ============================================================================
  // Resume CRUD
  // ============================================================================

  /**
   * Get all resumes for current user
   */
  async getAll(): Promise<ResumeListItem[]> {
    return httpClient.get<ResumeListItem[]>(BASE_URL);
  },

  /**
   * Get resume by ID
   */
  async getById(id: string): Promise<Resume> {
    return httpClient.get<Resume>(`${BASE_URL}/${id}`);
  },

  /**
   * Get public resume by slug
   */
  async getBySlug(slug: string): Promise<Resume> {
    return httpClient.get<Resume>(`${BASE_URL}/public/${slug}`);
  },

  /**
   * Create new resume
   */
  async create(data: CreateResumeDto): Promise<Resume> {
    return httpClient.post<Resume>(BASE_URL, data);
  },

  /**
   * Update resume
   */
  async update(id: string, data: UpdateResumeDto): Promise<Resume> {
    return httpClient.patch<Resume>(`${BASE_URL}/${id}`, data);
  },

  /**
   * Delete resume
   */
  async delete(id: string): Promise<void> {
    return httpClient.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Duplicate resume
   */
  async duplicate(id: string): Promise<Resume> {
    return httpClient.post<Resume>(`${BASE_URL}/${id}/duplicate`);
  },

  // ============================================================================
  // Experience
  // ============================================================================

  async addExperience(resumeId: string, data: CreateExperienceDto): Promise<Experience> {
    return httpClient.post<Experience>(`${BASE_URL}/${resumeId}/experiences`, data);
  },

  async updateExperience(
    resumeId: string,
    experienceId: string,
    data: Partial<CreateExperienceDto>
  ): Promise<Experience> {
    return httpClient.patch<Experience>(
      `${BASE_URL}/${resumeId}/experiences/${experienceId}`,
      data
    );
  },

  async deleteExperience(resumeId: string, experienceId: string): Promise<void> {
    return httpClient.delete(`${BASE_URL}/${resumeId}/experiences/${experienceId}`);
  },

  async reorderExperiences(resumeId: string, order: string[]): Promise<Experience[]> {
    return httpClient.patch<Experience[]>(`${BASE_URL}/${resumeId}/experiences/reorder`, { order });
  },

  // ============================================================================
  // Education
  // ============================================================================

  async addEducation(resumeId: string, data: CreateEducationDto): Promise<Education> {
    return httpClient.post<Education>(`${BASE_URL}/${resumeId}/educations`, data);
  },

  async updateEducation(
    resumeId: string,
    educationId: string,
    data: Partial<CreateEducationDto>
  ): Promise<Education> {
    return httpClient.patch<Education>(`${BASE_URL}/${resumeId}/educations/${educationId}`, data);
  },

  async deleteEducation(resumeId: string, educationId: string): Promise<void> {
    return httpClient.delete(`${BASE_URL}/${resumeId}/educations/${educationId}`);
  },

  // ============================================================================
  // Skills
  // ============================================================================

  async addSkill(resumeId: string, data: CreateSkillDto): Promise<Skill> {
    return httpClient.post<Skill>(`${BASE_URL}/${resumeId}/skills`, data);
  },

  async updateSkill(
    resumeId: string,
    skillId: string,
    data: Partial<CreateSkillDto>
  ): Promise<Skill> {
    return httpClient.patch<Skill>(`${BASE_URL}/${resumeId}/skills/${skillId}`, data);
  },

  async deleteSkill(resumeId: string, skillId: string): Promise<void> {
    return httpClient.delete(`${BASE_URL}/${resumeId}/skills/${skillId}`);
  },

  async bulkAddSkills(resumeId: string, skills: CreateSkillDto[]): Promise<Skill[]> {
    return httpClient.post<Skill[]>(`${BASE_URL}/${resumeId}/skills/bulk`, {
      skills,
    });
  },

  // ============================================================================
  // Languages
  // ============================================================================

  async addLanguage(resumeId: string, data: CreateLanguageDto): Promise<Language> {
    return httpClient.post<Language>(`${BASE_URL}/${resumeId}/languages`, data);
  },

  async updateLanguage(
    resumeId: string,
    languageId: string,
    data: Partial<CreateLanguageDto>
  ): Promise<Language> {
    return httpClient.patch<Language>(`${BASE_URL}/${resumeId}/languages/${languageId}`, data);
  },

  async deleteLanguage(resumeId: string, languageId: string): Promise<void> {
    return httpClient.delete(`${BASE_URL}/${resumeId}/languages/${languageId}`);
  },

  // ============================================================================
  // Certifications
  // ============================================================================

  async addCertification(resumeId: string, data: CreateCertificationDto): Promise<Certification> {
    return httpClient.post<Certification>(`${BASE_URL}/${resumeId}/certifications`, data);
  },

  async updateCertification(
    resumeId: string,
    certificationId: string,
    data: Partial<CreateCertificationDto>
  ): Promise<Certification> {
    return httpClient.patch<Certification>(
      `${BASE_URL}/${resumeId}/certifications/${certificationId}`,
      data
    );
  },

  async deleteCertification(resumeId: string, certificationId: string): Promise<void> {
    return httpClient.delete(`${BASE_URL}/${resumeId}/certifications/${certificationId}`);
  },

  // ============================================================================
  // Projects
  // ============================================================================

  async addProject(resumeId: string, data: CreateProjectDto): Promise<Project> {
    return httpClient.post<Project>(`${BASE_URL}/${resumeId}/projects`, data);
  },

  async updateProject(
    resumeId: string,
    projectId: string,
    data: Partial<CreateProjectDto>
  ): Promise<Project> {
    return httpClient.patch<Project>(`${BASE_URL}/${resumeId}/projects/${projectId}`, data);
  },

  async deleteProject(resumeId: string, projectId: string): Promise<void> {
    return httpClient.delete(`${BASE_URL}/${resumeId}/projects/${projectId}`);
  },

  // ============================================================================
  // Export
  // ============================================================================

  async exportPDF(resumeId: string): Promise<Blob> {
    const response = await httpClient.get<Blob>(`${BASE_URL}/${resumeId}/export/pdf`, {
      responseType: "blob",
    });
    return response;
  },

  async exportDOCX(resumeId: string): Promise<Blob> {
    const response = await httpClient.get<Blob>(`${BASE_URL}/${resumeId}/export/docx`, {
      responseType: "blob",
    });
    return response;
  },
};
