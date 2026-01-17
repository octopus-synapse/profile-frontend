/**
 * Features Index
 */

// Auth
export { authService } from "./auth";

// i18n
export { I18nProvider, useI18n, useT } from "./i18n";
export type { DictionaryKey } from "./i18n";

// Navigation
export { Navbar, MobileMenu, UserMenu, LanguageSwitcher, Logo } from "./navigation";

// Users
export {
  userRepository,
  userKeys,
  useMe,
  useMyStats,
  usePublicProfile,
  useCheckUsername,
  useAdminUsers,
  useAdminUser,
  useUpdateMe,
  useUploadProfileImage,
  useAdminUpdateUserRole,
  useAdminDeleteUser,
} from "./users";
export type {
  User,
  UserProfile,
  UserRole,
  UserStats,
  AdminUserFilters,
  PaginatedUsers,
  UpdateUserDto,
} from "./users";

// Resume
export {
  resumeRepository,
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
} from "./resume";
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
} from "./resume";

// Onboarding
// Note: onboardingRepository removed - use apiClient.onboarding instead
export {
  onboardingKeys,
  useOnboardingStatus,
  useSubmitOnboarding,
  useOnboardingStore,
  ONBOARDING_STEPS,
  OnboardingWizard,
  OnboardingShell,
  StepNavigation,
} from "./onboarding";
export type {
  OnboardingStep,
  OnboardingData,
  PersonalInfoData,
  ProfessionalProfileData,
  SkillData,
  LanguageData,
} from "./onboarding";
// Onboarding types with aliases to avoid conflicts with Resume types
export type {
  PersonalInfo as OnboardingPersonalInfo,
  ProfessionalProfile as OnboardingProfessionalProfile,
  Experience as OnboardingExperience,
  Education as OnboardingEducation,
  Skill as OnboardingSkill,
  Language as OnboardingLanguage,
  TemplateSelection as OnboardingTemplateSelection,
} from "./onboarding";

// MEC - Brazilian Ministry of Education data
export {
  InstitutionAutocomplete,
  CourseAutocomplete,
  useSearchInstitutions,
  useSearchCourses,
  useCoursesByInstitution,
  useInstitution,
  mecKeys,
} from "./mec";
export type {
  MecInstitution,
  MecCourse,
  MecInstitutionSearchResult,
  MecCourseSearchResult,
  InstitutionAutocompleteProps,
  CourseAutocompleteProps,
} from "./mec";

// Tech Skills - Pre-populated tech skills catalog
export {
  techSkillsRepository,
  techSkillsKeys,
  useTechAreas,
  useTechNiches,
  useTechNichesByArea,
  useProgrammingLanguages,
  useSearchLanguages,
  useTechSkills,
  useSearchTechSkills,
  useSkillsByNiche,
  useSkillsByType,
  useSearchAllTechSkills,
  TechSkillAutocomplete,
} from "./tech-skills";
export type {
  TechAreaType,
  SkillType,
  TechAreaDto,
  TechNicheDto,
  TechSkillDto,
  ProgrammingLanguageDto,
  TechSkillsSearchResult,
  TechSkillDisplayItem,
  TechSkillAutocompleteProps,
} from "./tech-skills";
