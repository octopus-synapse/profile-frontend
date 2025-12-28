/**
 * Resume Repository
 * Handles all resume-related API calls
 */

import type { HttpClient } from "../client";
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

export function createResumeRepository(client: HttpClient) {
  return {
    // ============================================================================
    // Resume CRUD
    // ============================================================================

    /**
     * Get all resumes for current user
     */
    async getAll(): Promise<ResumeListItem[]> {
      return client.get<ResumeListItem[]>(BASE_URL);
    },

    /**
     * Get resume by ID
     */
    async getById(id: string): Promise<Resume> {
      return client.get<Resume>(`${BASE_URL}/${id}`);
    },

    /**
     * Get public resume by slug
     */
    async getBySlug(slug: string): Promise<Resume> {
      return client.get<Resume>(`${BASE_URL}/public/${slug}`);
    },

    /**
     * Create new resume
     */
    async create(data: CreateResumeDto): Promise<Resume> {
      return client.post<Resume>(BASE_URL, data);
    },

    /**
     * Update resume
     */
    async update(id: string, data: UpdateResumeDto): Promise<Resume> {
      return client.patch<Resume>(`${BASE_URL}/${id}`, data);
    },

    /**
     * Delete resume
     */
    async delete(id: string): Promise<void> {
      return client.delete(`${BASE_URL}/${id}`);
    },

    /**
     * Duplicate resume
     */
    async duplicate(id: string): Promise<Resume> {
      return client.post<Resume>(`${BASE_URL}/${id}/duplicate`);
    },

    // ============================================================================
    // Experience
    // ============================================================================

    async addExperience(resumeId: string, data: CreateExperienceDto): Promise<Experience> {
      return client.post<Experience>(`${BASE_URL}/${resumeId}/experiences`, data);
    },

    async updateExperience(
      resumeId: string,
      experienceId: string,
      data: Partial<CreateExperienceDto>
    ): Promise<Experience> {
      return client.patch<Experience>(
        `${BASE_URL}/${resumeId}/experiences/${experienceId}`,
        data
      );
    },

    async deleteExperience(resumeId: string, experienceId: string): Promise<void> {
      return client.delete(`${BASE_URL}/${resumeId}/experiences/${experienceId}`);
    },

    async reorderExperiences(resumeId: string, order: string[]): Promise<Experience[]> {
      return client.patch<Experience[]>(`${BASE_URL}/${resumeId}/experiences/reorder`, { order });
    },

    // ============================================================================
    // Education
    // ============================================================================

    async addEducation(resumeId: string, data: CreateEducationDto): Promise<Education> {
      return client.post<Education>(`${BASE_URL}/${resumeId}/educations`, data);
    },

    async updateEducation(
      resumeId: string,
      educationId: string,
      data: Partial<CreateEducationDto>
    ): Promise<Education> {
      return client.patch<Education>(`${BASE_URL}/${resumeId}/educations/${educationId}`, data);
    },

    async deleteEducation(resumeId: string, educationId: string): Promise<void> {
      return client.delete(`${BASE_URL}/${resumeId}/educations/${educationId}`);
    },

    // ============================================================================
    // Skills
    // ============================================================================

    async addSkill(resumeId: string, data: CreateSkillDto): Promise<Skill> {
      return client.post<Skill>(`${BASE_URL}/${resumeId}/skills`, data);
    },

    async updateSkill(
      resumeId: string,
      skillId: string,
      data: Partial<CreateSkillDto>
    ): Promise<Skill> {
      return client.patch<Skill>(`${BASE_URL}/${resumeId}/skills/${skillId}`, data);
    },

    async deleteSkill(resumeId: string, skillId: string): Promise<void> {
      return client.delete(`${BASE_URL}/${resumeId}/skills/${skillId}`);
    },

    async bulkAddSkills(resumeId: string, skills: CreateSkillDto[]): Promise<Skill[]> {
      return client.post<Skill[]>(`${BASE_URL}/${resumeId}/skills/bulk`, { skills });
    },

    // ============================================================================
    // Languages
    // ============================================================================

    async addLanguage(resumeId: string, data: CreateLanguageDto): Promise<Language> {
      return client.post<Language>(`${BASE_URL}/${resumeId}/languages`, data);
    },

    async updateLanguage(
      resumeId: string,
      languageId: string,
      data: Partial<CreateLanguageDto>
    ): Promise<Language> {
      return client.patch<Language>(`${BASE_URL}/${resumeId}/languages/${languageId}`, data);
    },

    async deleteLanguage(resumeId: string, languageId: string): Promise<void> {
      return client.delete(`${BASE_URL}/${resumeId}/languages/${languageId}`);
    },

    // ============================================================================
    // Certifications
    // ============================================================================

    async addCertification(resumeId: string, data: CreateCertificationDto): Promise<Certification> {
      return client.post<Certification>(`${BASE_URL}/${resumeId}/certifications`, data);
    },

    async updateCertification(
      resumeId: string,
      certificationId: string,
      data: Partial<CreateCertificationDto>
    ): Promise<Certification> {
      return client.patch<Certification>(
        `${BASE_URL}/${resumeId}/certifications/${certificationId}`,
        data
      );
    },

    async deleteCertification(resumeId: string, certificationId: string): Promise<void> {
      return client.delete(`${BASE_URL}/${resumeId}/certifications/${certificationId}`);
    },

    // ============================================================================
    // Projects
    // ============================================================================

    async addProject(resumeId: string, data: CreateProjectDto): Promise<Project> {
      return client.post<Project>(`${BASE_URL}/${resumeId}/projects`, data);
    },

    async updateProject(
      resumeId: string,
      projectId: string,
      data: Partial<CreateProjectDto>
    ): Promise<Project> {
      return client.patch<Project>(`${BASE_URL}/${resumeId}/projects/${projectId}`, data);
    },

    async deleteProject(resumeId: string, projectId: string): Promise<void> {
      return client.delete(`${BASE_URL}/${resumeId}/projects/${projectId}`);
    },

    // ============================================================================
    // Export
    // ============================================================================

    async exportPDF(_resumeId: string): Promise<Blob> {
      return client.get<Blob>(`/export/resume/pdf`, {
        responseType: "blob",
      });
    },

    async exportDOCX(_resumeId: string): Promise<Blob> {
      return client.get<Blob>(`/export/resume/docx`, {
        responseType: "blob",
      });
    },
  };
}

export type ResumeRepository = ReturnType<typeof createResumeRepository>;
