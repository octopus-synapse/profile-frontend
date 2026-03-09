/**
 * Consent Store Tests
 *
 * Tests the pure state management for consent/GDPR.
 * Zustand stores are pure state containers - no side effects.
 */

import { describe, test, expect, beforeEach } from "bun:test";
import { createConsentStore } from "../consent.store";
import type { ConsentHistoryResponseDto } from "@profile/api-client";

// Helper to create valid mock consent
const createMockConsent = (
 overrides: Partial<ConsentHistoryResponseDto> = {},
): ConsentHistoryResponseDto => ({
 id: "consent-1",
 documentType: "TERMS_OF_SERVICE",
 version: "1.0.0",
 acceptedAt: "2024-01-15T10:00:00Z",
 ipAddress: "192.168.1.1",
 userAgent: "Mozilla/5.0...",
 ...overrides,
});

describe("ConsentStore (Pure State)", () => {
 let store: ReturnType<typeof createConsentStore>;

 beforeEach(() => {
  store = createConsentStore();
 });

 describe("initial state", () => {
  test("should initialize with empty consents", () => {
   expect(store.getState().consents).toEqual([]);
  });

  test("should initialize with loading false", () => {
   expect(store.getState().isLoading).toBe(false);
  });

  test("should initialize with null error", () => {
   expect(store.getState().error).toBeNull();
  });
 });

 describe("setConsents", () => {
  test("should set consents array", () => {
   const consents = [
    createMockConsent({ id: "1", documentType: "TERMS_OF_SERVICE" }),
    createMockConsent({ id: "2", documentType: "PRIVACY_POLICY" }),
   ];

   store.getState().setConsents(consents);

   expect(store.getState().consents).toHaveLength(2);
  });

  test("should replace existing consents", () => {
   store.getState().setConsents([createMockConsent({ id: "1" })]);
   store
    .getState()
    .setConsents([
     createMockConsent({ id: "2" }),
     createMockConsent({ id: "3" }),
    ]);

   expect(store.getState().consents).toHaveLength(2);
   expect(store.getState().consents[0].id).toBe("2");
  });

  test("should handle empty array", () => {
   store.getState().setConsents([createMockConsent({ id: "1" })]);
   store.getState().setConsents([]);

   expect(store.getState().consents).toEqual([]);
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
   store.getState().setError("Failed to load consents");

   expect(store.getState().error).toBe("Failed to load consents");
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

 describe("reset", () => {
  test("should reset all state to initial", () => {
   // Modify all state
   store.getState().setConsents([{ id: "1" }] as any);
   store.getState().setLoading(true);
   store.getState().setError("Error");

   // Reset
   store.getState().reset();

   // Verify all back to initial
   expect(store.getState().consents).toEqual([]);
   expect(store.getState().isLoading).toBe(false);
   expect(store.getState().error).toBeNull();
  });
 });

 describe("store isolation", () => {
  test("should create independent store instances", () => {
   const store1 = createConsentStore();
   const store2 = createConsentStore();

   store1.getState().setConsents([{ id: "consent-1" }] as any);
   store1.getState().setError("Store 1 error");

   expect(store1.getState().consents).toHaveLength(1);
   expect(store2.getState().consents).toHaveLength(0);
   expect(store2.getState().error).toBeNull();
  });
 });
});
