/**
 * API Client Smoke Tests - Kent Beck Style
 *
 * These tests answer ONE question: "Do the API client modules load correctly?"
 *
 * Characteristics:
 * - FAST: Run in < 2 seconds
 * - ISOLATED: No network calls, no external dependencies
 * - IMMEDIATE: First line of defense
 *
 * What they verify:
 * - All repositories can be imported
 * - Factory functions exist and are callable
 * - TypeScript types are valid
 *
 * What they DON'T verify:
 * - Actual API calls
 * - Business logic
 * - Error handling behavior
 */

import { describe, it, expect } from "bun:test";

describe("Smoke Tests - API Client Package", () => {
 describe("Repository Factory Imports", () => {
  it("should import createAuthRepository", async () => {
   const { createAuthRepository } =
    await import("../../packages/api-client/src/repositories/auth.repository");
   expect(createAuthRepository).toBeDefined();
   expect(typeof createAuthRepository).toBe("function");
  });

  it("should import createResumeRepository", async () => {
   const { createResumeRepository } =
    await import("../../packages/api-client/src/repositories/resume.repository");
   expect(createResumeRepository).toBeDefined();
   expect(typeof createResumeRepository).toBe("function");
  });

  it("should import createThemeRepository", async () => {
   const { createThemeRepository } =
    await import("../../packages/api-client/src/repositories/theme.repository");
   expect(createThemeRepository).toBeDefined();
   expect(typeof createThemeRepository).toBe("function");
  });

  it("should import createUserRepository", async () => {
   const { createUserRepository } =
    await import("../../packages/api-client/src/repositories/user.repository");
   expect(createUserRepository).toBeDefined();
   expect(typeof createUserRepository).toBe("function");
  });

  it("should import createTwoFactorRepository", async () => {
   const { createTwoFactorRepository } =
    await import("../../packages/api-client/src/repositories/two-factor.repository");
   expect(createTwoFactorRepository).toBeDefined();
   expect(typeof createTwoFactorRepository).toBe("function");
  });

  it("should import createOnboardingRepository", async () => {
   const { createOnboardingRepository } =
    await import("../../packages/api-client/src/repositories/onboarding.repository");
   expect(createOnboardingRepository).toBeDefined();
   expect(typeof createOnboardingRepository).toBe("function");
  });

  it("should import createTechSkillsRepository", async () => {
   const { createTechSkillsRepository } =
    await import("../../packages/api-client/src/repositories/tech-skills.repository");
   expect(createTechSkillsRepository).toBeDefined();
   expect(typeof createTechSkillsRepository).toBe("function");
  });

  it("should import createSocialRepository", async () => {
   const { createSocialRepository } =
    await import("../../packages/api-client/src/repositories/social.repository");
   expect(createSocialRepository).toBeDefined();
   expect(typeof createSocialRepository).toBe("function");
  });

  it("should import createExportRepository", async () => {
   const { createExportRepository } =
    await import("../../packages/api-client/src/repositories/export.repository");
   expect(createExportRepository).toBeDefined();
   expect(typeof createExportRepository).toBe("function");
  });

  it("should import createGDPRRepository", async () => {
   const { createGDPRRepository } =
    await import("../../packages/api-client/src/repositories/gdpr.repository");
   expect(createGDPRRepository).toBeDefined();
   expect(typeof createGDPRRepository).toBe("function");
  });
 });

 describe("HTTP Client Imports", () => {
  it("should import createHttpClient", async () => {
   const { createHttpClient } =
    await import("../../packages/api-client/src/client");
   expect(createHttpClient).toBeDefined();
   expect(typeof createHttpClient).toBe("function");
  });

  it("should import withRetry utility", async () => {
   const { withRetry } = await import("../../packages/api-client/src/client");
   expect(withRetry).toBeDefined();
   expect(typeof withRetry).toBe("function");
  });
 });

 describe("Error Types Imports", () => {
  it("should import createApiError factory", async () => {
   const errors = await import("../../packages/api-client/src/errors/index");
   expect(errors.createApiError).toBeDefined();
   expect(typeof errors.createApiError).toBe("function");
  });

  it("should import isValidationError helper", async () => {
   const errors = await import("../../packages/api-client/src/errors/index");
   expect(errors.isValidationError).toBeDefined();
   expect(typeof errors.isValidationError).toBe("function");
  });
 });

 describe("Main Package Export", () => {
  it("should import main index without errors", async () => {
   const apiClient = await import("../../packages/api-client/src/index");
   expect(apiClient).toBeDefined();
   expect(apiClient.createHttpClient).toBeDefined();
   expect(apiClient.createAuthRepository).toBeDefined();
   expect(apiClient.createResumeRepository).toBeDefined();
  });
 });
});
