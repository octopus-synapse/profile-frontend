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
 type UserRepository,
 type ResumeRepository,
 type OnboardingRepository,
 type ThemeRepository,
 type TechSkillsRepository,
 type AdminRepository,
 type AuthRepository,
 type SectionConfigRepository,
 type DslRepository,
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
 };
}
