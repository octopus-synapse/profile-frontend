/**
 * Hooks barrel export
 * Re-exports all feature hooks for easy importing
 */

// Auth
export { useAuth } from "./useAuth";
export type { UseAuthOptions, UseAuthReturn } from "./useAuth";

// Resume
export { useResume } from "./useResume";
export type { UseResumeOptions, UseResumeReturn } from "./useResume";

// Theme
export { useTheme } from "./useTheme";
export type { UseThemeOptions, UseThemeReturn } from "./useTheme";

// Export
export { useExport } from "./useExport";
export type { UseExportOptions, UseExportReturn } from "./useExport";

// Chat
export { useChat } from "./useChat";
export type { UseChatOptions, UseChatReturn } from "./useChat";

// Social
export { useSocial } from "./useSocial";
export type {
 UseSocialOptions,
 UseSocialReturn,
} from "./useSocial";
export type { UserProfile } from "@profile/api-client";

// Analytics
export { useAnalytics } from "./useAnalytics";
export type { UseAnalyticsOptions, UseAnalyticsReturn } from "./useAnalytics";

// Settings
export { useSettings } from "./useSettings";
export type { UseSettingsOptions, UseSettingsReturn } from "./useSettings";

// Two-Factor
export { useTwoFactor } from "./useTwoFactor";
export type { UseTwoFactorOptions, UseTwoFactorReturn } from "./useTwoFactor";

// Onboarding
export { useOnboarding } from "./useOnboarding";
export type {
 UseOnboardingOptions,
 UseOnboardingReturn,
} from "./useOnboarding";

// Admin
export { useAdmin } from "./useAdmin";
export type { UseAdminOptions, UseAdminReturn } from "./useAdmin";
