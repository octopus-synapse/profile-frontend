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
export {
  onboardingRepository,
  onboardingKeys,
  useOnboardingState,
  useSaveOnboardingProgress,
  useSubmitOnboarding,
  useSkipOnboarding,
  useResetOnboarding,
} from "./onboarding";
export type {
  OnboardingStep,
  OnboardingState,
  OnboardingData,
  PersonalInfoData,
  ProfessionalProfileData,
  SkillData,
  LanguageData,
} from "./onboarding";
