/**
 * Resume Feature
 */

// Types
export type {
  Resume,
  ResumeTemplate,
  ResumeListItem,
  Experience,
  Education,
  Skill,
  SkillLevel,
  Language,
  LanguageLevel,
  Certification,
  Project,
  CreateResumeDto,
  UpdateResumeDto,
  CreateExperienceDto,
  CreateEducationDto,
  CreateSkillDto,
  CreateLanguageDto,
  CreateCertificationDto,
  CreateProjectDto,
} from "./types";

// Repository
export { resumeRepository } from "./services/resume-repository";

// Hooks
export {
  resumeKeys,
  useResumes,
  useResume,
  usePublicResume,
  useCreateResume,
  useUpdateResume,
  useDeleteResume,
  useDuplicateResume,
  useAddExperience,
  useUpdateExperience,
  useDeleteExperience,
  useAddEducation,
  useUpdateEducation,
  useDeleteEducation,
  useAddSkill,
  useBulkAddSkills,
  useDeleteSkill,
  useAddLanguage,
  useDeleteLanguage,
  useAddCertification,
  useDeleteCertification,
  useAddProject,
  useDeleteProject,
  useExportResumePDF,
  useExportResumeDOCX,
} from "./hooks";
