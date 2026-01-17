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
  // Theme hooks
  useThemes,
  useSystemThemes,
  useMyThemes,
  usePopularThemes,
  usePendingThemes,
  useCreateTheme,
  useUpdateTheme,
  useDeleteTheme,
  useForkTheme,
  useApplyTheme,
  useSubmitForApproval,
  useApproveTheme,
  useRejectTheme,
} from "./hooks";

// Main Components
export { ResumeBuilder, ASTRenderer } from "./components";

// Theme Components
export {
  ThemeCard,
  ThemePicker,
  ThemeEditor,
  ThemePreview,
  JsonImportModal,
  MyThemesManager,
  ThemeApprovalQueue,
  ThemeReviewModal,
  ColorEditor,
  TypographyEditor,
  LayoutEditor,
  SpacingEditor,
} from "./components/theme";

// Theme Types
export type {
  Theme,
  ThemeStatus,
  CreateThemeInput,
  UpdateThemeInput,
} from "./services/theme.types";

// Theme Config Types (from types/config)
export type { DesignTokens, LayoutConfig, SectionConfig, ResumeStyleConfig } from "./types/config";
