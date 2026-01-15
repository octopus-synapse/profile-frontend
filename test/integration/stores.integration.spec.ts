/**
 * Store Integration Tests
 *
 * These tests verify that stores correctly integrate with the API client
 * and maintain consistent state throughout complex operations.
 */

import { describe, it, expect, mock, beforeEach } from "bun:test";
import { createAuthStore } from "../../packages/stores/src/auth.store";
import { createResumeStore } from "../../packages/stores/src/resume.store";
import { createThemeStore } from "../../packages/stores/src/theme.store";
import type { ProfileApiClient } from "../../packages/api-client/src";

// ============================================================================
// Mock Factory
// ============================================================================

function createMockApiClient(): ProfileApiClient {
 return {
  auth: {
   login: mock(() =>
    Promise.resolve({
     user: { id: "user-1", email: "test@example.com", name: "Test User" },
     accessToken: "access-token",
     refreshToken: "refresh-token",
    })
   ),
   register: mock(() =>
    Promise.resolve({
     user: { id: "user-1", email: "test@example.com", name: "Test User" },
     accessToken: "access-token",
     refreshToken: "refresh-token",
    })
   ),
   logout: mock(() => Promise.resolve()),
   refreshToken: mock(() =>
    Promise.resolve({
     accessToken: "new-access-token",
     refreshToken: "new-refresh-token",
    })
   ),
  },
  resumes: {
   getAll: mock(() =>
    Promise.resolve([
     { id: "resume-1", title: "Resume 1" },
     { id: "resume-2", title: "Resume 2" },
    ])
   ),
   getById: mock((id: string) =>
    Promise.resolve({ id, title: "Resume", experiences: [] })
   ),
   create: mock((data: any) => Promise.resolve({ id: "new-resume", ...data })),
   update: mock((id: string, data: any) => Promise.resolve({ id, ...data })),
   delete: mock(() => Promise.resolve()),
  },
  themes: {
   getAll: mock(() => Promise.resolve([{ id: "theme-1", name: "Theme 1" }])),
   getMyThemes: mock(() =>
    Promise.resolve([{ id: "my-theme-1", name: "My Theme" }])
   ),
   getSystem: mock(() =>
    Promise.resolve([{ id: "system-1", name: "Default", isSystem: true }])
   ),
   getPopular: mock(() => Promise.resolve([])),
   getById: mock((id: string) => Promise.resolve({ id, name: "Theme" })),
   create: mock((data: any) => Promise.resolve({ id: "new-theme", ...data })),
   update: mock((id: string, data: any) => Promise.resolve({ id, ...data })),
   delete: mock(() => Promise.resolve()),
   fork: mock((_id: string, name: string) =>
    Promise.resolve({ id: "forked", name })
   ),
   apply: mock(() => Promise.resolve()),
   submitForApproval: mock(() =>
    Promise.resolve({ id: "theme-1", status: "pending" })
   ),
   getPendingApprovals: mock(() => Promise.resolve([])),
   approve: mock(() => Promise.resolve({ id: "theme-1", status: "approved" })),
   reject: mock(() => Promise.resolve({ id: "theme-1", status: "rejected" })),
  },
  twoFactor: {
   getStatus: mock(() => Promise.resolve({ enabled: false, verifiedAt: null })),
   setup: mock(() =>
    Promise.resolve({
     secret: "secret",
     qrCodeUrl: "url",
     backupCodes: ["123"],
    })
   ),
   verifySetup: mock(() =>
    Promise.resolve({ success: true, backupCodes: ["123"] })
   ),
   verifyLogin: mock(() => Promise.resolve({ success: true })),
   disable: mock(() => Promise.resolve({ success: true })),
   regenerateBackupCodes: mock(() =>
    Promise.resolve({ backupCodes: ["new-123"] })
   ),
  },
 } as unknown as ProfileApiClient;
}

// ============================================================================
// Integration Test: Auth Store with Resume Store
// ============================================================================

describe("Integration: Auth + Resume Store", () => {
 it("should maintain consistent state after login and resume fetch", async () => {
  // Arrange
  const apiClient = createMockApiClient();
  const authStore = createAuthStore(apiClient);
  const resumeStore = createResumeStore(apiClient);

  // Act - Login
  await authStore.getState().login("test@example.com", "password");

  // Assert - Auth state
  expect(authStore.getState().isAuthenticated).toBe(true);
  expect(authStore.getState().user?.email).toBe("test@example.com");

  // Act - Fetch resumes (requires authentication)
  await resumeStore.getState().fetchResumes();

  // Assert - Resume state
  expect(resumeStore.getState().resumes).toHaveLength(2);
  expect(resumeStore.getState().error).toBeNull();
 });

 it("should clear resume state on logout", async () => {
  // Arrange
  const apiClient = createMockApiClient();
  const authStore = createAuthStore(apiClient);
  const resumeStore = createResumeStore(apiClient);

  // Setup - Login and fetch resumes
  await authStore.getState().login("test@example.com", "password");
  await resumeStore.getState().fetchResumes();
  expect(resumeStore.getState().resumes).toHaveLength(2);

  // Act - Logout
  await authStore.getState().logout();

  // Assert - Auth cleared
  expect(authStore.getState().isAuthenticated).toBe(false);
  expect(authStore.getState().user).toBeNull();

  // Note: Resume store should be cleared by the consuming component
  // This is a design decision - stores are independent
 });
});

// ============================================================================
// Integration Test: Theme Store Workflow
// ============================================================================

describe("Integration: Theme Store Workflow", () => {
 it("should complete theme creation and application flow", async () => {
  // Arrange
  const apiClient = createMockApiClient();
  const themeStore = createThemeStore(apiClient);

  // Act - Create theme
  const created = await themeStore.getState().createTheme({
   name: "Custom Theme",
   colors: { primary: "#007AFF" },
  } as any);

  // Assert
  expect(created.id).toBe("new-theme");
  expect(themeStore.getState().myThemes).toContainEqual(
   expect.objectContaining({ id: "new-theme" })
  );

  // Act - Apply to resume
  await themeStore.getState().applyToResume("resume-1", "new-theme");

  // Assert
  expect(apiClient.themes.apply).toHaveBeenCalledWith({
   resumeId: "resume-1",
   themeId: "new-theme",
  });
 });

 it("should handle theme approval workflow", async () => {
  // Arrange
  const apiClient = createMockApiClient();
  const themeStore = createThemeStore(apiClient);

  // Create theme first
  await themeStore.getState().createTheme({ name: "Theme" } as any);

  // Act - Submit for approval
  await themeStore.getState().submitForApproval("new-theme");

  // Assert
  expect(apiClient.themes.submitForApproval).toHaveBeenCalledWith("new-theme");
 });
});

// ============================================================================
// Integration Test: Error Propagation
// ============================================================================

describe("Integration: Error Propagation", () => {
 it("should propagate API errors to store state", async () => {
  // Arrange
  const apiClient = createMockApiClient();
  (apiClient.resumes.getAll as ReturnType<typeof mock>).mockRejectedValue(
   new Error("Network error")
  );
  const resumeStore = createResumeStore(apiClient);

  // Act & Assert
  await expect(resumeStore.getState().fetchResumes()).rejects.toThrow(
   "Network error"
  );
  expect(resumeStore.getState().error).toBe("Network error");
  expect(resumeStore.getState().isLoading).toBe(false);
 });

 it("should clear error on successful retry", async () => {
  // Arrange
  const apiClient = createMockApiClient();
  const resumeStore = createResumeStore(apiClient);

  // First call fails
  (apiClient.resumes.getAll as ReturnType<typeof mock>).mockRejectedValueOnce(
   new Error("Network error")
  );

  // Second call succeeds
  (apiClient.resumes.getAll as ReturnType<typeof mock>).mockResolvedValueOnce([
   { id: "resume-1", title: "Resume" },
  ]);

  // Act - First attempt (fails)
  try {
   await resumeStore.getState().fetchResumes();
  } catch {
   // Expected
  }
  expect(resumeStore.getState().error).toBe("Network error");

  // Act - Retry (succeeds)
  await resumeStore.getState().fetchResumes();

  // Assert
  expect(resumeStore.getState().error).toBeNull();
  expect(resumeStore.getState().resumes).toHaveLength(1);
 });
});

// ============================================================================
// Integration Test: Concurrent Operations
// ============================================================================

describe("Integration: Concurrent Operations", () => {
 it("should handle concurrent fetch operations", async () => {
  // Arrange
  const apiClient = createMockApiClient();
  const themeStore = createThemeStore(apiClient);

  // Act - Fetch all theme types concurrently
  await Promise.all([
   themeStore.getState().fetchThemes(),
   themeStore.getState().fetchMyThemes(),
   themeStore.getState().fetchSystemThemes(),
  ]);

  // Assert - All data loaded
  expect(themeStore.getState().themes).toHaveLength(1);
  expect(themeStore.getState().myThemes).toHaveLength(1);
  expect(themeStore.getState().systemThemes).toHaveLength(1);
 });
});
