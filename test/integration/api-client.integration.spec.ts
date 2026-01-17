/**
 * API Client Integration Tests
 *
 * These tests verify that the API client correctly integrates
 * all repositories and can be used as a cohesive unit.
 *
 * Note: These tests use mocked HTTP responses, not real API calls.
 * Real API integration tests should be done in E2E tests.
 */

import { describe, it, expect, mock, beforeEach } from "bun:test";
import {
 createAuthRepository,
 createResumeRepository,
 createThemeRepository,
 createTwoFactorRepository,
} from "../../packages/api-client/src";
import type { HttpClient } from "../../packages/api-client/src/client";

// ============================================================================
// Integration Test: Full Client Assembly
// ============================================================================

describe("Integration: API Client Assembly", () => {
 describe("createProfileApiClient factory", () => {
  it("should create a complete API client with all repositories", async () => {
   // Arrange - Create mock HTTP client
   const mockHttpClient: HttpClient = {
    get: mock(() => Promise.resolve({})),
    post: mock(() => Promise.resolve({})),
    put: mock(() => Promise.resolve({})),
    patch: mock(() => Promise.resolve({})),
    delete: mock(() => Promise.resolve()),
    setToken: mock(() => {}),
    clearToken: mock(() => {}),
   };

   // Act - Create all repositories
   const auth = createAuthRepository(mockHttpClient);
   const resumes = createResumeRepository(mockHttpClient);
   const themes = createThemeRepository(mockHttpClient);
   const twoFactor = createTwoFactorRepository(mockHttpClient);

   // Assert - All repositories are defined
   expect(auth).toBeDefined();
   expect(resumes).toBeDefined();
   expect(themes).toBeDefined();
   expect(twoFactor).toBeDefined();

   // Assert - All repositories have expected methods
   expect(typeof auth.login).toBe("function");
   expect(typeof resumes.getAll).toBe("function");
   expect(typeof themes.getAll).toBe("function");
   expect(typeof twoFactor.getStatus).toBe("function");
  });
 });
});

// ============================================================================
// Integration Test: Auth Flow
// ============================================================================

describe("Integration: Authentication Flow", () => {
 let mockHttpClient: HttpClient;
 let authRepo: ReturnType<typeof createAuthRepository>;

 beforeEach(() => {
  mockHttpClient = {
   get: mock(() => Promise.resolve({})),
   post: mock(() => Promise.resolve({})),
   put: mock(() => Promise.resolve({})),
   patch: mock(() => Promise.resolve({})),
   delete: mock(() => Promise.resolve()),
   setToken: mock(() => {}),
   clearToken: mock(() => {}),
  };
  authRepo = createAuthRepository(mockHttpClient);
 });

 it("should complete login -> get user flow", async () => {
  // Arrange
  const loginResponse = {
   success: true,
   data: {
    user: {
     id: "user-1",
     email: "test@example.com",
     name: "Test",
     hasCompletedOnboarding: true,
    },
    accessToken: "access-token",
    refreshToken: "refresh-token",
    expiresIn: 3600,
   },
  };
  (mockHttpClient.post as ReturnType<typeof mock>).mockResolvedValue(
   loginResponse
  );

  // Act - Login
  const result = await authRepo.login({
   email: "test@example.com",
   password: "password123",
  });

  // Assert
  expect(result.user.email).toBe("test@example.com");
  expect(result.accessToken).toBe("access-token");
  expect(mockHttpClient.post).toHaveBeenCalledWith("/v1/auth/login", {
   email: "test@example.com",
   password: "password123",
  });
 });

 it("should complete register -> login flow", async () => {
  // Arrange
  const authResponse = {
   success: true,
   data: {
    user: {
     id: "user-1",
     email: "new@example.com",
     name: "New User",
     hasCompletedOnboarding: false,
    },
    accessToken: "access-token",
    refreshToken: "refresh-token",
    expiresIn: 3600,
   },
  };
  (mockHttpClient.post as ReturnType<typeof mock>).mockResolvedValue(
   authResponse
  );

  // Act - Register
  const registerResult = await authRepo.register({
   email: "new@example.com",
   password: "password123",
   name: "New User",
  });

  // Assert
  expect(registerResult.user.email).toBe("new@example.com");

  // Act - Login with same credentials
  const loginResult = await authRepo.login({
   email: "new@example.com",
   password: "password123",
  });

  // Assert
  expect(loginResult.accessToken).toBe("access-token");
 });

 it("should handle token refresh flow", async () => {
  // Arrange
  const refreshResponse = {
   success: true,
   data: {
    accessToken: "new-access-token",
    refreshToken: "new-refresh-token",
    expiresIn: 1800,
    user: {
     id: "user-1",
     email: "test@example.com",
     name: "Test",
     hasCompletedOnboarding: true,
    },
   },
  };
  (mockHttpClient.post as ReturnType<typeof mock>).mockResolvedValue(
   refreshResponse
  );

  // Act
  const result = await authRepo.refreshToken("old-refresh-token");

  // Assert
  expect(result.accessToken).toBe("new-access-token");
  expect(mockHttpClient.post).toHaveBeenCalledWith("/v1/auth/refresh", {
   refreshToken: "old-refresh-token",
  });
 });
});

// ============================================================================
// Integration Test: Resume CRUD Flow
// ============================================================================

describe("Integration: Resume CRUD Flow", () => {
 let mockHttpClient: HttpClient;
 let resumeRepo: ReturnType<typeof createResumeRepository>;

 beforeEach(() => {
  mockHttpClient = {
   get: mock(() => Promise.resolve({})),
   post: mock(() => Promise.resolve({})),
   put: mock(() => Promise.resolve({})),
   patch: mock(() => Promise.resolve({})),
   delete: mock(() => Promise.resolve()),
   setToken: mock(() => {}),
   clearToken: mock(() => {}),
  };
  resumeRepo = createResumeRepository(mockHttpClient);
 });

 it("should complete create -> read -> update -> delete flow", async () => {
  // Arrange
  const createdResume = {
   id: "resume-1",
   title: "Software Engineer",
   slug: "software-engineer",
  };

  // Create
  (mockHttpClient.post as ReturnType<typeof mock>).mockResolvedValue(
   createdResume
  );
  const created = await resumeRepo.create({ title: "Software Engineer" });
  expect(created.id).toBe("resume-1");

  // Read
  (mockHttpClient.get as ReturnType<typeof mock>).mockResolvedValue(
   createdResume
  );
  const fetched = await resumeRepo.getById("resume-1");
  expect(fetched.title).toBe("Software Engineer");

  // Update
  const updatedResume = { ...createdResume, title: "Senior Engineer" };
  (mockHttpClient.patch as ReturnType<typeof mock>).mockResolvedValue(
   updatedResume
  );
  const updated = await resumeRepo.update("resume-1", {
   title: "Senior Engineer",
  });
  expect(updated.title).toBe("Senior Engineer");

  // Delete
  (mockHttpClient.delete as ReturnType<typeof mock>).mockResolvedValue(
   undefined
  );
  await resumeRepo.delete("resume-1");
  expect(mockHttpClient.delete).toHaveBeenCalledWith("/v1/resumes/resume-1");
 });

 it("should handle nested resources (experiences)", async () => {
  // Arrange
  const experience = {
   id: "exp-1",
   company: "Tech Corp",
   title: "Developer",
  };
  (mockHttpClient.post as ReturnType<typeof mock>).mockResolvedValue(
   experience
  );

  // Act
  const result = await resumeRepo.addExperience("resume-1", {
   company: "Tech Corp",
   title: "Developer",
   startDate: "2020-01-01",
  } as any);

  // Assert
  expect(result.id).toBe("exp-1");
  expect(mockHttpClient.post).toHaveBeenCalledWith(
   "/v1/resumes/resume-1/experiences",
   expect.any(Object)
  );
 });
});

// ============================================================================
// Integration Test: Two-Factor Authentication Flow
// ============================================================================

describe("Integration: Two-Factor Authentication Flow", () => {
 let mockHttpClient: HttpClient;
 let twoFactorRepo: ReturnType<typeof createTwoFactorRepository>;

 beforeEach(() => {
  mockHttpClient = {
   get: mock(() => Promise.resolve({})),
   post: mock(() => Promise.resolve({})),
   put: mock(() => Promise.resolve({})),
   patch: mock(() => Promise.resolve({})),
   delete: mock(() => Promise.resolve()),
   setToken: mock(() => {}),
   clearToken: mock(() => {}),
  };
  twoFactorRepo = createTwoFactorRepository(mockHttpClient);
 });

 it("should complete full 2FA setup flow", async () => {
  // Step 1: Get status (should be disabled)
  (mockHttpClient.get as ReturnType<typeof mock>).mockResolvedValue({
   enabled: false,
   verifiedAt: null,
  });
  const initialStatus = await twoFactorRepo.getStatus();
  expect(initialStatus.enabled).toBe(false);

  // Step 2: Start setup
  const setupResponse = {
   secret: "JBSWY3DPEHPK3PXP",
   qrCodeUrl: "data:image/png;base64,...",
   backupCodes: ["12345678", "23456789"],
  };
  (mockHttpClient.post as ReturnType<typeof mock>).mockResolvedValue(
   setupResponse
  );
  const setup = await twoFactorRepo.setup();
  expect(setup.secret).toBeDefined();
  expect(setup.qrCodeUrl).toBeDefined();

  // Step 3: Verify setup
  (mockHttpClient.post as ReturnType<typeof mock>).mockResolvedValue({
   success: true,
   backupCodes: ["12345678", "23456789"],
  });
  const verifyResult = await twoFactorRepo.verifySetup({ token: "123456" });
  expect(verifyResult.success).toBe(true);

  // Step 4: Status should now be enabled
  (mockHttpClient.get as ReturnType<typeof mock>).mockResolvedValue({
   enabled: true,
   verifiedAt: new Date().toISOString(),
  });
  const finalStatus = await twoFactorRepo.getStatus();
  expect(finalStatus.enabled).toBe(true);
 });

 it("should handle 2FA login verification", async () => {
  // Arrange
  (mockHttpClient.post as ReturnType<typeof mock>).mockResolvedValue({
   success: true,
  });

  // Act
  const result = await twoFactorRepo.verifyLogin({ token: "123456" });

  // Assert
  expect(result.success).toBe(true);
  expect(mockHttpClient.post).toHaveBeenCalledWith(
   "/v1/auth/2fa/verify-login",
   {
    token: "123456",
   }
  );
 });
});
