/**
 * @profile/api-client
 * Framework-agnostic API client for Profile services
 */

// Client exports
export {
 createHttpClient,
 withRetry,
 type HttpClient,
 type HttpClientConfig,
 type RetryConfig,
 type TokenGetter,
 type TokenRefresher,
 type OnUnauthorized,
} from "./client";

// Repository exports
export {
 createUserRepository,
 createResumeRepository,
 createOnboardingRepository,
 createThemeRepository,
 createTechSkillsRepository,
 createAdminRepository,
 createAuthRepository,
 createSectionConfigRepository,
 createDslRepository,
 createSocialRepository,
 createChatRepository,
 createGitHubRepository,
 createExportRepository,
 createPublicResumeRepository,
 createShareRepository,
 createATSRepository,
 createTranslationRepository,
 createGDPRRepository,
 createTwoFactorRepository,
 createResumeImportRepository,
 createAnalyticsRepository,
 createSpokenLanguagesRepository,
 createConsentRepository,
 type UserRepository,
 type ResumeRepository,
 type OnboardingRepository,
 type ThemeRepository,
 type TechSkillsRepository,
 type AdminRepository,
 type AuthRepository,
 type SectionConfigRepository,
 type DslRepository,
 type SocialRepository,
 type ChatRepository,
 type GitHubRepository,
 type ExportRepository,
 type PublicResumeRepository,
 type ShareRepository,
 type ATSRepository,
 type TranslationRepository,
 type GDPRRepository,
 type TwoFactorRepository,
 type ResumeImportRepository,
 type AnalyticsRepository,
 type SpokenLanguagesRepository,
 type ConsentRepository,
} from "./repositories";

// Type exports
export * from "./types";

// Error exports
export * from "./errors";

// ============================================================================
// Convenience API Client Factory
// ============================================================================

import { createHttpClient, type HttpClientConfig } from "./client";
import { createUserRepository } from "./repositories/user.repository";
import { createResumeRepository } from "./repositories/resume.repository";
import { createOnboardingRepository } from "./repositories/onboarding.repository";
import { createThemeRepository } from "./repositories/theme.repository";
import { createTechSkillsRepository } from "./repositories/tech-skills.repository";
import { createAdminRepository } from "./repositories/admin.repository";
import { createAuthRepository } from "./repositories/auth.repository";
import { createSectionConfigRepository } from "./repositories/section-config.repository";
import { createDslRepository } from "./repositories/dsl.repository";
import { createSocialRepository } from "./repositories/social.repository";
import { createChatRepository } from "./repositories/chat.repository";
import { createGitHubRepository } from "./repositories/github.repository";
import { createExportRepository } from "./repositories/export.repository";
import { createPublicResumeRepository } from "./repositories/public-resume.repository";
import { createShareRepository } from "./repositories/share.repository";
import { createATSRepository } from "./repositories/ats.repository";
import { createTranslationRepository } from "./repositories/translation.repository";
import { createGDPRRepository } from "./repositories/gdpr.repository";
import { createTwoFactorRepository } from "./repositories/two-factor.repository";
import { createResumeImportRepository } from "./repositories/resume-import.repository";
import { createAnalyticsRepository } from "./repositories/analytics.repository";
import { createSpokenLanguagesRepository } from "./repositories/spoken-languages.repository";
import { createConsentRepository } from "./repositories/consent.repository";
import { createAdvancedSectionsRepository } from "./repositories/advanced-sections.repository";

export interface ProfileApiClient {
 users: ReturnType<typeof createUserRepository>;
 resumes: ReturnType<typeof createResumeRepository>;
 onboarding: ReturnType<typeof createOnboardingRepository>;
 themes: ReturnType<typeof createThemeRepository>;
 techSkills: ReturnType<typeof createTechSkillsRepository>;
 admin: ReturnType<typeof createAdminRepository>;
 auth: ReturnType<typeof createAuthRepository>;
 sectionConfig: ReturnType<typeof createSectionConfigRepository>;
 dsl: ReturnType<typeof createDslRepository>;
 social: ReturnType<typeof createSocialRepository>;
 chat: ReturnType<typeof createChatRepository>;
 github: ReturnType<typeof createGitHubRepository>;
 export: ReturnType<typeof createExportRepository>;
 publicResume: ReturnType<typeof createPublicResumeRepository>;
 share: ReturnType<typeof createShareRepository>;
 ats: ReturnType<typeof createATSRepository>;
 translation: ReturnType<typeof createTranslationRepository>;
 gdpr: ReturnType<typeof createGDPRRepository>;
 twoFactor: ReturnType<typeof createTwoFactorRepository>;
 resumeImport: ReturnType<typeof createResumeImportRepository>;
 analytics: ReturnType<typeof createAnalyticsRepository>;
 spokenLanguages: ReturnType<typeof createSpokenLanguagesRepository>;
 consent: ReturnType<typeof createConsentRepository>;
 advancedSections: ReturnType<typeof createAdvancedSectionsRepository>;
}

/**
 * Create a configured API client with all repositories
 *
 * @example
 * ```ts
 * // Next.js with NextAuth
 * const apiClient = createProfileApiClient({
 *   baseURL: process.env.NEXT_PUBLIC_API_URL!,
 *   getToken: async () => {
 *     const session = await getSession();
 *     return session?.accessToken ?? null;
 *   },
 * });
 *
 * // React Native with AsyncStorage
 * const apiClient = createProfileApiClient({
 *   baseURL: 'https://api.example.com',
 *   getToken: () => AsyncStorage.getItem('accessToken'),
 * });
 *
 * // Usage
 * const user = await apiClient.users.getMe();
 * const resumes = await apiClient.resumes.getAll();
 * const themes = await apiClient.themes.getSystem();
 * ```
 */
export function createProfileApiClient(
 config: HttpClientConfig
): ProfileApiClient {
 const httpClient = createHttpClient(config);

 return {
  users: createUserRepository(httpClient),
  resumes: createResumeRepository(httpClient),
  onboarding: createOnboardingRepository(httpClient),
  themes: createThemeRepository(httpClient),
  techSkills: createTechSkillsRepository(httpClient),
  admin: createAdminRepository(httpClient),
  auth: createAuthRepository(httpClient),
  sectionConfig: createSectionConfigRepository(httpClient),
  dsl: createDslRepository(httpClient),
  social: createSocialRepository(httpClient),
  chat: createChatRepository(httpClient),
  github: createGitHubRepository(httpClient),
  export: createExportRepository(httpClient),
  publicResume: createPublicResumeRepository(httpClient),
  share: createShareRepository(httpClient),
  ats: createATSRepository(httpClient),
  translation: createTranslationRepository(httpClient),
  gdpr: createGDPRRepository(httpClient),
  twoFactor: createTwoFactorRepository(httpClient),
  resumeImport: createResumeImportRepository(httpClient),
  analytics: createAnalyticsRepository(httpClient),
  spokenLanguages: createSpokenLanguagesRepository(httpClient),
  consent: createConsentRepository(httpClient),
  advancedSections: createAdvancedSectionsRepository(httpClient),
 };
}
