/**
 * Shared base exports for @profile/api-client mocks.
 *
 * Why this exists: Bun's mock.module leaks across test files in the same run.
 * When one file mocks @profile/api-client with a partial export set,
 * other files that transitively import the real module see missing exports.
 * Spreading this base into every mock ensures all route constants and
 * commonly-used SDK hooks are always present.
 */

import { mock } from 'bun:test';

export const API_CLIENT_MOCK_BASE = {
  // Route constants consumed transitively across the app
  ACCOUNTS_ROUTES: { ACCOUNTS_SIGNUP: '/api/accounts' },
  ADMIN_SECTION_TYPES_ROUTES: {
    ADMIN_SECTION_TYPES_LIST: '/api/v1/admin/section-types',
    ADMIN_SECTION_TYPES_CREATE: '/api/v1/admin/section-types',
  },
  ATS_VALIDATION_ROUTES: { ATS_VALIDATION_VALIDATE_C_V: '/api/v1/ats/validate' },
  AUTH_ROUTES: {
    AUTH_DISABLE: '/api/auth/2fa',
    AUTH_LOGIN: '/api/auth/login',
    AUTH_LOGOUT: '/api/auth/logout',
    AUTH_REFRESH: '/api/auth/refresh',
    AUTH_GET_SESSION: '/api/auth/session',
  },
  PLATFORM_ROUTES: {
    PLATFORM_CHECK: '/api/health',
    PLATFORM_CHECK_DATABASE: '/api/health/db',
    PLATFORM_CHECK_REDIS: '/api/health/redis',
    PLATFORM_CHECK_STORAGE: '/api/health/storage',
    PLATFORM_CHECK_TRANSLATE: '/api/health/translate',
    PLATFORM_GET_STATISTICS: '/api/v1/platform/stats',
  },
  RESUMES_ROUTES: {
    RESUMES_GET_ALL_USER_RESUMES: '/api/v1/resumes',
    RESUMES_CREATE_RESUME_FOR_USER: '/api/v1/resumes',
    RESUMES_GET_REMAINING_SLOTS: '/api/v1/resumes/slots',
    RESUMES_CREATE_SHARE: '/api/v1/shares',
  },
  RESUME_IMPORT_ROUTES: {
    RESUME_IMPORT_GET_HISTORY: '/api/resume-import',
    RESUME_IMPORT_IMPORT_JSON: '/api/resume-import/json',
    RESUME_IMPORT_PARSE_JSON: '/api/resume-import/parse',
  },
  ONBOARDING_ROUTES: {
    ONBOARDING_COMPLETE_ONBOARDING: '/api/v1/onboarding',
    ONBOARDING_GET_PROGRESS: '/api/v1/onboarding/progress',
    ONBOARDING_SAVE_PROGRESS: '/api/v1/onboarding/progress',
    ONBOARDING_GET_SESSION: '/api/v1/onboarding/session',
    ONBOARDING_COMPLETE_FROM_SESSION: '/api/v1/onboarding/session/complete',
    ONBOARDING_GOTO_STEP: '/api/v1/onboarding/session/goto',
    ONBOARDING_NEXT_STEP: '/api/v1/onboarding/session/next',
    ONBOARDING_PREVIOUS_STEP: '/api/v1/onboarding/session/previous',
    ONBOARDING_SAVE_STEP_DATA: '/api/v1/onboarding/session/save',
  },
  USERS_ROUTES: {
    USERS_HANDLE: '/api/password/reset',
    USERS_GET_PROFILE: '/api/v1/users/profile',
    USERS_UPDATE_PROFILE: '/api/v1/users/profile',
    USERS_UPDATE_USERNAME: '/api/v1/users/username',
    USERS_CHECK_USERNAME_AVAILABILITY: '/api/v1/users/username/check',
  },

  // SDK functions and hooks consumed transitively
  usersGetProfile: mock(),
  usersUpdateProfile: mock(),
  usersCheckUsernameAvailability: mock(),
  usersGetPublicProfileByUsername: mock(),
  uploadUploadProfileImage: mock(),
  isApiError: mock(),

  // Onboarding hooks
  useOnboardingNextStep: mock(),
  useOnboardingPreviousStep: mock(),
  useOnboardingGotoStep: mock(),
  useOnboardingSaveStepData: mock(),
  useOnboardingGetSession: mock(),
  useOnboardingCompleteFromSession: mock(),
  getOnboardingGetSessionQueryKey: mock(() => ['onboarding-session']),

  // URL builder functions (commonly imported transitively)
  getApiBaseUrl: mock(() => 'http://localhost:3001/api'),
  getBackendHost: mock(() => 'http://localhost:3001'),
} as const;
