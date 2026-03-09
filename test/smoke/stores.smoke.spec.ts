/**
 * Store Smoke Tests
 *
 * Validates that all stores can be created and have required exports.
 * These are NOT integration tests - they test module structure only.
 *
 * Decision: Stores are pure state containers (Zustand) without API dependencies.
 * API calls are handled by hooks/repositories at the component level.
 */

import { describe, it, expect } from "bun:test";

describe("Smoke: Store Exports", () => {
 describe("Store Factory Functions", () => {
  it("should export createAuthStore", async () => {
   const { createAuthStore } =
    await import("../../packages/stores/src/auth.store");
   expect(createAuthStore).toBeDefined();
   expect(typeof createAuthStore).toBe("function");
  });

  it("should export createTwoFactorStore", async () => {
   const { createTwoFactorStore } =
    await import("../../packages/stores/src/two-factor.store");
   expect(createTwoFactorStore).toBeDefined();
   expect(typeof createTwoFactorStore).toBe("function");
  });

  it("should export createOnboardingStore", async () => {
   const { createOnboardingStore } =
    await import("../../packages/stores/src/onboarding.store");
   expect(createOnboardingStore).toBeDefined();
   expect(typeof createOnboardingStore).toBe("function");
  });

  it("should export createAdminStore", async () => {
   const { createAdminStore } =
    await import("../../packages/stores/src/admin.store");
   expect(createAdminStore).toBeDefined();
   expect(typeof createAdminStore).toBe("function");
  });

  it("should export createExportStore", async () => {
   const { createExportStore } =
    await import("../../packages/stores/src/export.store");
   expect(createExportStore).toBeDefined();
   expect(typeof createExportStore).toBe("function");
  });
 });

 describe("Store Instantiation", () => {
  it("AuthStore should create a valid store instance", async () => {
   const { createAuthStore } =
    await import("../../packages/stores/src/auth.store");
   const store = createAuthStore();

   expect(store).toBeDefined();
   expect(store.getState).toBeDefined();
   expect(store.setState).toBeDefined();
   expect(store.subscribe).toBeDefined();
  });

  it("TwoFactorStore should create a valid store instance", async () => {
   const { createTwoFactorStore } =
    await import("../../packages/stores/src/two-factor.store");
   const store = createTwoFactorStore();

   expect(store).toBeDefined();
   expect(store.getState).toBeDefined();
   expect(store.setState).toBeDefined();
  });
 });

 describe("Main Index Exports", () => {
  it("should export all stores from main index", async () => {
   const stores = await import("../../packages/stores/src");

   expect(stores.createAuthStore).toBeDefined();
   expect(stores.createTwoFactorStore).toBeDefined();
   expect(stores.createOnboardingStore).toBeDefined();
   expect(stores.createAdminStore).toBeDefined();
   expect(stores.createExportStore).toBeDefined();
  });
 });

 describe("Store State Structure", () => {
  it("AuthStore should have expected state shape", async () => {
   const { createAuthStore } =
    await import("../../packages/stores/src/auth.store");
   const store = createAuthStore();
   const state = store.getState();

   // Check required state properties exist
   expect("isAuthenticated" in state).toBe(true);
   expect("user" in state).toBe(true);
   expect("isLoading" in state).toBe(true);
  });

  it("AuthStore should have required setters", async () => {
   const { createAuthStore } =
    await import("../../packages/stores/src/auth.store");
   const store = createAuthStore();
   const state = store.getState();

   // Stores are pure state containers - they have setters, not actions
   expect(typeof state.setUser).toBe("function");
   expect(typeof state.setTokens).toBe("function");
   expect(typeof state.reset).toBe("function");
  });
 });
});
