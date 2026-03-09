/**
 * Hook Aliases
 *
 * Re-exports generated hooks with shorter, more ergonomic names.
 * The generated hooks are the source of truth - these are just aliases.
 *
 * DISCIPLINE: No business logic here. Just re-exports for DX.
 */

// =============================================================================
// Tech Skills / Niches Aliases
// =============================================================================

export {
 useTechNichesGetNiches as useTechNiches,
 useTechNichesGetSkillsByNiche as useSkillsByNiche,
} from "./generated/api/tech-niches/tech-niches";

export {
 useTechSkillsGetSkills as useSearchTechSkills,
 useTechSkillsGetSkills as useSearchAllTechSkills,
 useTechSkillsGetSkills as useTechSkills,
 useTechSkillsGetSkillsByType as useSkillsByType,
} from "./generated/api/tech-skills/tech-skills";

export {
 useTechAreasGetAreas as useTechAreas,
 useTechAreasGetNichesByArea as useTechNichesByArea,
} from "./generated/api/tech-areas/tech-areas";

// =============================================================================
// MEC (Institutions / Courses) Aliases
// =============================================================================

export {
 useMecInstitutionsSearchInstitutionsByName as useSearchInstitutions,
 useMecInstitutionsGetInstitutionByCodeWithCourses as useInstitutionByCode,
 useMecInstitutionsListInstitutions as useInstitutions,
} from "./generated/api/mec-institutions/mec-institutions";

export {
 useMecCoursesSearchCoursesByName as useSearchCourses,
 useMecCoursesGetCourseByCode as useCourseByCode,
} from "./generated/api/mec-courses/mec-courses";

// =============================================================================
// Themes Aliases
// =============================================================================

export {
 useThemesGetAllThemesByUser as useMyThemes,
 useThemesGetPending as usePendingThemes,
 useThemesCreateThemeForUser as useCreateTheme,
 useThemesUpdateThemeForUser as useUpdateTheme,
 useThemesDeleteThemeForUser as useDeleteTheme,
 useThemesSubmit as useSubmitForApproval,
 useThemesReview as useReviewTheme,
 useThemesFindAllSystemThemes as useSystemThemes,
 useThemesFindPopularThemes as usePopularThemes,
 useThemesFindThemeById as useThemeById,
 useThemesApply as useApplyTheme,
 useThemesFork as useForkTheme,
} from "./generated/api/themes/themes";

// =============================================================================
// Resumes Aliases
// =============================================================================

export {
 useResumesGetAllUserResumes as useResumes,
 useResumesGetResumeDetails as useResumeDetails,
 useResumesCreateResumeForUser as useCreateResume,
 useResumesUpdateResumeForUser as useUpdateResume,
 useResumesDeleteResumeForUser as useDeleteResume,
 useResumesGetRemainingSlots as useRemainingSlots,
} from "./generated/api/resumes/resumes";

// =============================================================================
// Users Aliases
// =============================================================================

export {
 useUsersGetProfile as useProfile,
 useUsersUpdateProfile as useUpdateProfile,
 useUsersGetPublicProfileByUsername as usePublicProfile,
 useUsersCheckUsernameAvailability as useCheckUsername,
 useUsersUpdateUsername as useUpdateUsername,
 useUsersListUsers as useUsers,
 useUsersGetUserDetails as useUserDetails,
 useUsersDeleteUser as useDeleteUser,
} from "./generated/api/users/users";

// =============================================================================
// Onboarding Aliases
// =============================================================================

export {
 useOnboardingGetProgress as useOnboardingProgress,
 useOnboardingGetStatus as useOnboardingStatus,
 useOnboardingSaveProgress as useSaveOnboardingProgress,
 useOnboardingCompleteOnboarding as useCompleteOnboarding,
} from "./generated/api/onboarding/onboarding";

// =============================================================================
// Upload Aliases
// =============================================================================

export {
 useUploadUploadProfileImage as useUploadProfileImage,
 useUploadUploadCompanyLogo as useUploadCompanyLogo,
 useUploadDeleteFile as useDeleteFile,
} from "./generated/api/upload/upload";
