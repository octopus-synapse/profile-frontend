/**
 * Settings Store Tests
 *
 * Tests the pure state management for user settings.
 * Zustand stores are pure state containers - no side effects.
 */

import { describe, test, expect, beforeEach } from "bun:test";
import { createSettingsStore } from "../settings.store";
import type { UserProfileResponseDto } from "@profile/api-client";

// Helper to create valid mock settings
const createMockSettings = (
 overrides: Partial<UserProfileResponseDto> = {},
): UserProfileResponseDto => ({
 id: "123",
 email: "user@example.com",
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString(),
 username: "johndoe",
 displayName: "John Doe",
 ...overrides,
});

describe("SettingsStore (Pure State)", () => {
 let store: ReturnType<typeof createSettingsStore>;

 beforeEach(() => {
  store = createSettingsStore();
 });

 describe("initial state", () => {
  test("should initialize with null settings", () => {
   expect(store.getState().settings).toBeNull();
  });

  test("should initialize with loading false", () => {
   expect(store.getState().isLoading).toBe(false);
  });

  test("should initialize with null error", () => {
   expect(store.getState().error).toBeNull();
  });
 });

 describe("setSettings", () => {
  test("should set settings object", () => {
   const settings = createMockSettings();

   store.getState().setSettings(settings);

   expect(store.getState().settings).toEqual(settings);
  });

  test("should replace existing settings", () => {
   const settings1 = createMockSettings({ id: "1", email: "old@example.com" });
   const settings2 = createMockSettings({ id: "2", email: "new@example.com" });

   store.getState().setSettings(settings1);
   store.getState().setSettings(settings2);

   expect(store.getState().settings?.email).toBe("new@example.com");
  });

  test("should handle settings with optional fields", () => {
   const settings = createMockSettings({
    username: undefined,
    displayName: undefined,
   });

   store.getState().setSettings(settings);

   expect(store.getState().settings?.username).toBeUndefined();
   expect(store.getState().settings?.displayName).toBeUndefined();
  });
 });

 describe("loading state", () => {
  test("should set loading to true", () => {
   store.getState().setLoading(true);

   expect(store.getState().isLoading).toBe(true);
  });

  test("should set loading to false", () => {
   store.getState().setLoading(true);
   store.getState().setLoading(false);

   expect(store.getState().isLoading).toBe(false);
  });
 });

 describe("error handling", () => {
  test("should set error message", () => {
   store.getState().setError("Failed to load settings");

   expect(store.getState().error).toBe("Failed to load settings");
  });

  test("should clear error with setError null", () => {
   store.getState().setError("Error");
   store.getState().setError(null);

   expect(store.getState().error).toBeNull();
  });

  test("should clear error with clearError", () => {
   store.getState().setError("Error");
   store.getState().clearError();

   expect(store.getState().error).toBeNull();
  });
 });

 describe("store isolation", () => {
  test("should create independent store instances", () => {
   const store1 = createSettingsStore();
   const store2 = createSettingsStore();

   store1.getState().setSettings(createMockSettings({ id: "1" }));
   store1.getState().setError("Store 1 error");

   expect(store1.getState().settings).not.toBeNull();
   expect(store2.getState().settings).toBeNull();
   expect(store2.getState().error).toBeNull();
  });
 });

 describe("state transitions", () => {
  test("should handle typical load flow", () => {
   // Start loading
   store.getState().setLoading(true);
   expect(store.getState().isLoading).toBe(true);

   // Load complete
   store
    .getState()
    .setSettings(createMockSettings({ id: "1", email: "test@example.com" }));
   store.getState().setLoading(false);

   expect(store.getState().isLoading).toBe(false);
   expect(store.getState().settings).not.toBeNull();
  });

  test("should handle error flow", () => {
   // Start loading
   store.getState().setLoading(true);

   // Error occurs
   store.getState().setError("Network error");
   store.getState().setLoading(false);

   expect(store.getState().isLoading).toBe(false);
   expect(store.getState().error).toBe("Network error");
   expect(store.getState().settings).toBeNull();
  });

  test("should handle retry after error", () => {
   // First attempt fails
   store.getState().setError("Network error");

   // Retry
   store.getState().clearError();
   store.getState().setLoading(true);
   store.getState().setSettings(createMockSettings({ id: "1" }));
   store.getState().setLoading(false);

   expect(store.getState().error).toBeNull();
   expect(store.getState().settings).not.toBeNull();
  });
 });
});
