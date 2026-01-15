/**
 * Stores Smoke Tests - Kent Beck Style
 *
 * These tests verify that all Zustand stores can be created and have correct structure.
 *
 * Characteristics:
 * - FAST: Run in < 2 seconds
 * - ISOLATED: No API calls, stores use mocked clients
 * - IMMEDIATE: Catch broken imports before unit tests
 */

import { describe, it, expect, mock } from "bun:test";

// Mock ApiClient factory for stores
function createMockApiClient() {
 return {
  auth: {
   login: mock(() => Promise.resolve({})),
   register: mock(() => Promise.resolve({})),
   logout: mock(() => Promise.resolve()),
   refreshToken: mock(() => Promise.resolve({})),
  },
  resumes: {
   getAll: mock(() => Promise.resolve([])),
   getById: mock(() => Promise.resolve({})),
   create: mock(() => Promise.resolve({})),
   update: mock(() => Promise.resolve({})),
   delete: mock(() => Promise.resolve()),
  },
  themes: {
   getAll: mock(() => Promise.resolve([])),
   getMyThemes: mock(() => Promise.resolve([])),
   getSystem: mock(() => Promise.resolve([])),
   create: mock(() => Promise.resolve({})),
  },
  twoFactor: {
   getStatus: mock(() => Promise.resolve({ enabled: false })),
   setup: mock(() => Promise.resolve({})),
  },
  onboarding: {
   getStatus: mock(() => Promise.resolve({})),
   startOnboarding: mock(() => Promise.resolve({})),
  },
 } as any;
}

describe("Smoke Tests - Stores Package", () => {
 describe("Store Factory Imports", () => {
  it("should import createAuthStore", async () => {
   const { createAuthStore } =
    await import("../../packages/stores/src/auth.store");
   expect(createAuthStore).toBeDefined();
   expect(typeof createAuthStore).toBe("function");
  });

  it("should import createResumeStore", async () => {
   const { createResumeStore } =
    await import("../../packages/stores/src/resume.store");
   expect(createResumeStore).toBeDefined();
   expect(typeof createResumeStore).toBe("function");
  });

  it("should import createThemeStore", async () => {
   const { createThemeStore } =
    await import("../../packages/stores/src/theme.store");
   expect(createThemeStore).toBeDefined();
   expect(typeof createThemeStore).toBe("function");
  });

  it("should import createTwoFactorStore", async () => {
   const { createTwoFactorStore } =
    await import("../../packages/stores/src/two-factor.store");
   expect(createTwoFactorStore).toBeDefined();
   expect(typeof createTwoFactorStore).toBe("function");
  });

  it("should import createOnboardingStore", async () => {
   const { createOnboardingStore } =
    await import("../../packages/stores/src/onboarding.store");
   expect(createOnboardingStore).toBeDefined();
   expect(typeof createOnboardingStore).toBe("function");
  });
 });

 describe("Store Creation", () => {
  it("should create AuthStore with initial state", async () => {
   const { createAuthStore } =
    await import("../../packages/stores/src/auth.store");
   const apiClient = createMockApiClient();
   const store = createAuthStore(apiClient);

   const state = store.getState();
   expect(state.user).toBeNull();
   expect(state.isAuthenticated).toBe(false);
   expect(state.isLoading).toBe(false);
   expect(state.error).toBeNull();
  });

  it("should create ResumeStore with initial state", async () => {
   const { createResumeStore } =
    await import("../../packages/stores/src/resume.store");
   const apiClient = createMockApiClient();
   const store = createResumeStore(apiClient);

   const state = store.getState();
   expect(state.resumes).toEqual([]);
   expect(state.currentResume).toBeNull();
   expect(state.isLoading).toBe(false);
  });

  it("should create ThemeStore with initial state", async () => {
   const { createThemeStore } =
    await import("../../packages/stores/src/theme.store");
   const apiClient = createMockApiClient();
   const store = createThemeStore(apiClient);

   const state = store.getState();
   expect(state.themes).toEqual([]);
   expect(state.myThemes).toEqual([]);
   expect(state.currentTheme).toBeNull();
  });

  it("should create TwoFactorStore with initial state", async () => {
   const { createTwoFactorStore } =
    await import("../../packages/stores/src/two-factor.store");
   const apiClient = createMockApiClient();
   const store = createTwoFactorStore(apiClient);

   const state = store.getState();
   expect(state.status).toBeNull();
   expect(state.setup).toBeNull();
   expect(state.backupCodes).toEqual([]);
  });
 });

 describe("Store Actions Existence", () => {
  it("AuthStore should have required actions", async () => {
   const { createAuthStore } =
    await import("../../packages/stores/src/auth.store");
   const apiClient = createMockApiClient();
   const store = createAuthStore(apiClient);
   const state = store.getState();

   expect(typeof state.login).toBe("function");
   expect(typeof state.register).toBe("function");
   expect(typeof state.logout).toBe("function");
   expect(typeof state.refreshToken).toBe("function");
  });

  it("ResumeStore should have required actions", async () => {
   const { createResumeStore } =
    await import("../../packages/stores/src/resume.store");
   const apiClient = createMockApiClient();
   const store = createResumeStore(apiClient);
   const state = store.getState();

   expect(typeof state.fetchResumes).toBe("function");
   expect(typeof state.fetchResume).toBe("function");
   expect(typeof state.createResume).toBe("function");
   expect(typeof state.updateResume).toBe("function");
   expect(typeof state.deleteResume).toBe("function");
  });
 });

 describe("Main Package Export", () => {
  it("should import main index without errors", async () => {
   const stores = await import("../../packages/stores/src/index");
   expect(stores).toBeDefined();
   expect(stores.createAuthStore).toBeDefined();
   expect(stores.createResumeStore).toBeDefined();
   expect(stores.createThemeStore).toBeDefined();
  });
 });
});
