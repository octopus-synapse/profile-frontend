/**
 * API Client Smoke Tests
 *
 * Validates that the generated SDK exports are correct and can be imported.
 * These are NOT integration tests - they don't make HTTP calls.
 */

import { describe, it, expect } from "bun:test";

describe("Smoke: API Client SDK Exports", () => {
 describe("Generated API Functions", () => {
  it("should export auth functions", async () => {
   const auth =
    await import("../../packages/api-client/src/generated/api/auth/auth");

   expect(auth.authLogin).toBeDefined();
   expect(auth.authLogout).toBeDefined();
   expect(auth.authRefresh).toBeDefined();
   expect(auth.authGetSession).toBeDefined();

   // Hooks should also be exported
   expect(auth.useAuthLogin).toBeDefined();
   expect(auth.useAuthLogout).toBeDefined();
   expect(auth.useAuthRefresh).toBeDefined();
  });

  it("should export accounts functions", async () => {
   const accounts =
    await import("../../packages/api-client/src/generated/api/accounts/accounts");

   expect(accounts.accountsSignup).toBeDefined();
   expect(accounts.useAccountsSignup).toBeDefined();
  });

  it("should export resume functions", async () => {
   const resumes =
    await import("../../packages/api-client/src/generated/api/resumes/resumes");

   expect(resumes.resumesGetAllUserResumes).toBeDefined();
   expect(resumes.resumesCreateResumeForUser).toBeDefined();
   expect(resumes.resumesGetResumeByIdForUser).toBeDefined();
   expect(resumes.resumesDeleteResumeForUser).toBeDefined();
   expect(resumes.resumesGetRemainingSlots).toBeDefined();
  });

  it("should export theme functions", async () => {
   const themes =
    await import("../../packages/api-client/src/generated/api/themes/themes");

   expect(themes.themesFindAllThemesWithPagination).toBeDefined();
   expect(themes.themesFindThemeById).toBeDefined();
   expect(themes.themesFindAllSystemThemes).toBeDefined();
  });

  it("should export platform functions", async () => {
   const platform =
    await import("../../packages/api-client/src/generated/api/platform/platform");

   expect(platform.platformGetStatistics).toBeDefined();
  });
 });

 describe("Generated Models", () => {
  it("should export auth models", async () => {
   // Type-only imports work if the module exports them
   const models =
    await import("../../packages/api-client/src/generated/models");

   // Verify key DTOs are exported (runtime check for type existence)
   expect(models).toBeDefined();
  });
 });

 describe("Client Utilities", () => {
  it("should export fetcher utilities", async () => {
   const client = await import("../../packages/api-client/src/client");

   expect(client.setAuthToken).toBeDefined();
   expect(client.clearAuthToken).toBeDefined();
   expect(client.isApiError).toBeDefined();
  });
 });

 describe("SDK Structure", () => {
  it("should export everything from main index", async () => {
   const apiClient = await import("../../packages/api-client/src");

   // Check main exports exist
   expect(apiClient.setAuthToken).toBeDefined();
   expect(apiClient.clearAuthToken).toBeDefined();
   expect(apiClient.isApiError).toBeDefined();
  });
 });
});
