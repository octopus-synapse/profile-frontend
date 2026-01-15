/**
 * Stores Package
 * Zustand stores for state management
 */

// Auth
export {
 createAuthStore,
 type AuthStore,
 type AuthState,
 type AuthActions,
} from "./auth.store";

// Resume
export {
 createResumeStore,
 type ResumeStore,
 type ResumeState,
 type ResumeActions,
} from "./resume.store";

// Chat
export {
 createChatStore,
 type ChatStore,
 type ChatState,
 type ChatActions,
} from "./chat.store";

// Social
export {
 createSocialStore,
 type SocialStore,
 type SocialState,
 type SocialActions,
} from "./social.store";

// Theme
export {
 createThemeStore,
 type ThemeStore,
 type ThemeState,
 type ThemeActions,
 type Theme,
} from "./theme.store";

// Export
export {
 createExportStore,
 type ExportStore,
 type ExportState,
 type ExportActions,
 type ExportFormat,
 type ExportJob,
} from "./export.store";

// Analytics
export {
 createAnalyticsStore,
 type AnalyticsStore,
 type AnalyticsState,
 type AnalyticsActions,
 type ResumeAnalytics,
 type ShareAnalytics,
 type UserAnalyticsSummary,
 type AnalyticsTimeRange,
} from "./analytics.store";

// Two-Factor
export {
 createTwoFactorStore,
 type TwoFactorStore,
 type TwoFactorState,
 type TwoFactorActions,
 type TwoFactorSetup,
 type TwoFactorStatus,
} from "./two-factor.store";

// Onboarding
export {
 createOnboardingStore,
 type OnboardingStore,
 type OnboardingState,
 type OnboardingActions,
 type OnboardingStatus,
 type OnboardingProgress,
} from "./onboarding.store";

// Settings
export {
 createSettingsStore,
 type SettingsStore,
 type SettingsState,
 type SettingsActions,
 type UserSettings,
 type UserDataExport,
} from "./settings.store";

// Admin
export {
 createAdminStore,
 type AdminStore,
 type AdminState,
 type AdminActions,
 type AdminStats,
 type RecentActivity,
 type SystemHealth,
 type AdminUser,
} from "./admin.store";

// Consent
export {
 createConsentStore,
 type ConsentStore,
 type ConsentState,
 type ConsentActions,
} from "./consent.store";

// Advanced Sections
export {
 createAdvancedSectionsStore,
 type AdvancedSectionsStore,
 type AdvancedSectionsState,
 type AdvancedSectionsActions,
} from "./advanced-sections.store";
