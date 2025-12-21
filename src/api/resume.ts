import { api, apiRequest } from './client'
import type {
  Resume,
  Experience,
  Education,
  Skill,
  Language,
  Project,
  Certification,
  Award,
  CreateResumeRequest,
  UpdateResumeRequest,
  ResumeListResponse,
  ResumeDetailResponse,
} from './types/resume'

export const resumeApi = {
  /**
   * Listar currículos do usuário
   */
  list: () =>
    apiRequest<ResumeListResponse>(api.get('/resumes')),

  /**
   * Obter detalhes de um currículo
   */
  get: (id: string) =>
    apiRequest<ResumeDetailResponse>(api.get(`/resumes/${id}`)),

  /**
   * Criar novo currículo
   */
  create: (data: CreateResumeRequest) =>
    apiRequest<Resume>(api.post('/resumes', data)),

  /**
   * Atualizar currículo
   */
  update: (id: string, data: UpdateResumeRequest) =>
    apiRequest<Resume>(api.patch(`/resumes/${id}`, data)),

  /**
   * Deletar currículo
   */
  delete: (id: string) =>
    apiRequest<void>(api.delete(`/resumes/${id}`)),

  /**
   * Duplicar currículo
   */
  duplicate: (id: string) =>
    apiRequest<Resume>(api.post(`/resumes/${id}/duplicate`)),

  // === EXPERIENCES ===

  addExperience: (resumeId: string, data: Omit<Experience, 'id' | 'resumeId'>) =>
    apiRequest<Experience>(api.post(`/resumes/${resumeId}/experiences`, data)),

  updateExperience: (resumeId: string, expId: string, data: Partial<Experience>) =>
    apiRequest<Experience>(api.patch(`/resumes/${resumeId}/experiences/${expId}`, data)),

  deleteExperience: (resumeId: string, expId: string) =>
    apiRequest<void>(api.delete(`/resumes/${resumeId}/experiences/${expId}`)),

  reorderExperiences: (resumeId: string, experienceIds: string[]) =>
    apiRequest<void>(api.patch(`/resumes/${resumeId}/experiences/reorder`, { experienceIds })),

  // === EDUCATION ===

  addEducation: (resumeId: string, data: Omit<Education, 'id' | 'resumeId'>) =>
    apiRequest<Education>(api.post(`/resumes/${resumeId}/education`, data)),

  updateEducation: (resumeId: string, eduId: string, data: Partial<Education>) =>
    apiRequest<Education>(api.patch(`/resumes/${resumeId}/education/${eduId}`, data)),

  deleteEducation: (resumeId: string, eduId: string) =>
    apiRequest<void>(api.delete(`/resumes/${resumeId}/education/${eduId}`)),

  reorderEducation: (resumeId: string, educationIds: string[]) =>
    apiRequest<void>(api.patch(`/resumes/${resumeId}/education/reorder`, { educationIds })),

  // === SKILLS ===

  addSkill: (resumeId: string, data: Omit<Skill, 'id' | 'resumeId'>) =>
    apiRequest<Skill>(api.post(`/resumes/${resumeId}/skills`, data)),

  updateSkill: (resumeId: string, skillId: string, data: Partial<Skill>) =>
    apiRequest<Skill>(api.patch(`/resumes/${resumeId}/skills/${skillId}`, data)),

  deleteSkill: (resumeId: string, skillId: string) =>
    apiRequest<void>(api.delete(`/resumes/${resumeId}/skills/${skillId}`)),

  // === LANGUAGES ===

  addLanguage: (resumeId: string, data: Omit<Language, 'id' | 'resumeId'>) =>
    apiRequest<Language>(api.post(`/resumes/${resumeId}/languages`, data)),

  updateLanguage: (resumeId: string, langId: string, data: Partial<Language>) =>
    apiRequest<Language>(api.patch(`/resumes/${resumeId}/languages/${langId}`, data)),

  deleteLanguage: (resumeId: string, langId: string) =>
    apiRequest<void>(api.delete(`/resumes/${resumeId}/languages/${langId}`)),

  // === PROJECTS ===

  addProject: (resumeId: string, data: Omit<Project, 'id' | 'resumeId'>) =>
    apiRequest<Project>(api.post(`/resumes/${resumeId}/projects`, data)),

  updateProject: (resumeId: string, projId: string, data: Partial<Project>) =>
    apiRequest<Project>(api.patch(`/resumes/${resumeId}/projects/${projId}`, data)),

  deleteProject: (resumeId: string, projId: string) =>
    apiRequest<void>(api.delete(`/resumes/${resumeId}/projects/${projId}`)),

  // === CERTIFICATIONS ===

  addCertification: (resumeId: string, data: Omit<Certification, 'id' | 'resumeId'>) =>
    apiRequest<Certification>(api.post(`/resumes/${resumeId}/certifications`, data)),

  updateCertification: (resumeId: string, certId: string, data: Partial<Certification>) =>
    apiRequest<Certification>(api.patch(`/resumes/${resumeId}/certifications/${certId}`, data)),

  deleteCertification: (resumeId: string, certId: string) =>
    apiRequest<void>(api.delete(`/resumes/${resumeId}/certifications/${certId}`)),

  // === AWARDS ===

  addAward: (resumeId: string, data: Omit<Award, 'id' | 'resumeId'>) =>
    apiRequest<Award>(api.post(`/resumes/${resumeId}/awards`, data)),

  updateAward: (resumeId: string, awardId: string, data: Partial<Award>) =>
    apiRequest<Award>(api.patch(`/resumes/${resumeId}/awards/${awardId}`, data)),

  deleteAward: (resumeId: string, awardId: string) =>
    apiRequest<void>(api.delete(`/resumes/${resumeId}/awards/${awardId}`)),
}
