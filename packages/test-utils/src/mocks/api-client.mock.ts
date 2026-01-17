/**
 * API Client Mock
 * Creates a fully typed mock of the ProfileApiClient
 */

import { mock } from "bun:test";

export interface MockApiClientOptions {
 defaultResponses?: Partial<{
  auth: Record<string, unknown>;
  users: Record<string, unknown>;
  resumes: Record<string, unknown>;
  themes: Record<string, unknown>;
  twoFactor: Record<string, unknown>;
  onboarding: Record<string, unknown>;
  skills: Record<string, unknown>;
 }>;
}

/**
 * Create a fully mocked API client
 */
export function createMockApiClient(options: MockApiClientOptions = {}) {
 const { defaultResponses = {} } = options;

 return {
  auth: {
   login: mock(() =>
    Promise.resolve(
     defaultResponses.auth?.login ?? {
      accessToken: "mock-token",
      refreshToken: "mock-refresh",
     }
    )
   ),
   register: mock(() =>
    Promise.resolve(
     defaultResponses.auth?.register ?? {
      id: "user-1",
      email: "user@example.com",
     }
    )
   ),
   logout: mock(() => Promise.resolve()),
   refreshToken: mock(() =>
    Promise.resolve(
     defaultResponses.auth?.refreshToken ?? { accessToken: "new-token" }
    )
   ),
   forgotPassword: mock(() => Promise.resolve()),
   resetPassword: mock(() => Promise.resolve()),
   verifyEmail: mock(() => Promise.resolve()),
   resendVerification: mock(() => Promise.resolve()),
   changePassword: mock(() => Promise.resolve()),
  },
  users: {
   getMe: mock(() =>
    Promise.resolve(
     defaultResponses.users?.getMe ?? {
      id: "user-1",
      email: "user@example.com",
      username: "testuser",
     }
    )
   ),
   updateMe: mock(() =>
    Promise.resolve(defaultResponses.users?.updateMe ?? { id: "user-1" })
   ),
   deleteMe: mock(() => Promise.resolve()),
   checkUsername: mock(() =>
    Promise.resolve(
     defaultResponses.users?.checkUsername ?? { available: true }
    )
   ),
   checkEmail: mock(() =>
    Promise.resolve(defaultResponses.users?.checkEmail ?? { available: true })
   ),
  },
  resumes: {
   getAll: mock(() => Promise.resolve(defaultResponses.resumes?.getAll ?? [])),
   getById: mock(() =>
    Promise.resolve(
     defaultResponses.resumes?.getById ?? {
      id: "resume-1",
      title: "Test Resume",
     }
    )
   ),
   create: mock(() =>
    Promise.resolve(defaultResponses.resumes?.create ?? { id: "resume-1" })
   ),
   update: mock(() =>
    Promise.resolve(defaultResponses.resumes?.update ?? { id: "resume-1" })
   ),
   delete: mock(() => Promise.resolve()),
   duplicate: mock(() =>
    Promise.resolve(defaultResponses.resumes?.duplicate ?? { id: "resume-2" })
   ),
   setDefault: mock(() => Promise.resolve()),
   publish: mock(() => Promise.resolve()),
   unpublish: mock(() => Promise.resolve()),
  },
  themes: {
   getAll: mock(() => Promise.resolve(defaultResponses.themes?.getAll ?? [])),
   getById: mock(() =>
    Promise.resolve(
     defaultResponses.themes?.getById ?? { id: "theme-1", name: "Default" }
    )
   ),
   getSystem: mock(() =>
    Promise.resolve(defaultResponses.themes?.getSystem ?? [])
   ),
   create: mock(() =>
    Promise.resolve(defaultResponses.themes?.create ?? { id: "theme-1" })
   ),
   update: mock(() =>
    Promise.resolve(defaultResponses.themes?.update ?? { id: "theme-1" })
   ),
   delete: mock(() => Promise.resolve()),
   apply: mock(() => Promise.resolve()),
  },
  twoFactor: {
   getStatus: mock(() =>
    Promise.resolve(defaultResponses.twoFactor?.getStatus ?? { enabled: false })
   ),
   setup: mock(() =>
    Promise.resolve(
     defaultResponses.twoFactor?.setup ?? {
      secret: "mock-secret",
      qrCode: "mock-qr",
     }
    )
   ),
   verify: mock(() =>
    Promise.resolve(
     defaultResponses.twoFactor?.verify ?? { verified: true, backupCodes: [] }
    )
   ),
   disable: mock(() => Promise.resolve()),
   regenerateBackupCodes: mock(() =>
    Promise.resolve(
     defaultResponses.twoFactor?.regenerateBackupCodes ?? { codes: [] }
    )
   ),
  },
  onboarding: {
   getStatus: mock(() =>
    Promise.resolve(
     defaultResponses.onboarding?.getStatus ?? { hasCompletedOnboarding: false }
    )
   ),
   getProgress: mock(() =>
    Promise.resolve(
     defaultResponses.onboarding?.getProgress ?? {
      currentStep: 1,
      totalSteps: 5,
     }
    )
   ),
   saveProgress: mock(() => Promise.resolve()),
   complete: mock(() => Promise.resolve()),
   skip: mock(() => Promise.resolve()),
  },
  skills: {
   search: mock(() => Promise.resolve(defaultResponses.skills?.search ?? [])),
   getPopular: mock(() =>
    Promise.resolve(defaultResponses.skills?.getPopular ?? [])
   ),
   getCategories: mock(() =>
    Promise.resolve(defaultResponses.skills?.getCategories ?? [])
   ),
  },
 };
}

export type MockApiClient = ReturnType<typeof createMockApiClient>;

/**
 * Reset all mocks on the API client
 */
export function resetMockApiClient(apiClient: MockApiClient): void {
 Object.values(apiClient).forEach((repository) => {
  Object.values(repository).forEach((method) => {
   if (typeof method === "function" && "mockClear" in method) {
    (method as ReturnType<typeof mock>).mockClear();
   }
  });
 });
}
