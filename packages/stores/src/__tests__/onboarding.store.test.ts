/**
 * Onboarding Store Tests
 *
 * Tests the pure state management for onboarding flow.
 * Zustand stores are pure state containers - no side effects.
 */

import { describe, test, expect, beforeEach } from "bun:test";
import { createOnboardingStore } from "../onboarding.store";

describe("OnboardingStore (Pure State)", () => {
 let store: ReturnType<typeof createOnboardingStore>;

 beforeEach(() => {
  store = createOnboardingStore();
 });

 describe("initial state", () => {
  test("should initialize with step 0", () => {
   expect(store.getState().currentStep).toBe(0);
  });

  test("should initialize with empty data", () => {
   expect(store.getState().data).toEqual({});
  });

  test("should initialize with loading false", () => {
   expect(store.getState().isLoading).toBe(false);
  });

  test("should initialize with null error", () => {
   expect(store.getState().error).toBeNull();
  });
 });

 describe("step navigation", () => {
  test("should increment step with nextStep", () => {
   store.getState().nextStep();

   expect(store.getState().currentStep).toBe(1);
  });

  test("should increment multiple times", () => {
   store.getState().nextStep();
   store.getState().nextStep();
   store.getState().nextStep();

   expect(store.getState().currentStep).toBe(3);
  });

  test("should decrement step with previousStep", () => {
   store.getState().nextStep();
   store.getState().nextStep();
   store.getState().previousStep();

   expect(store.getState().currentStep).toBe(1);
  });

  test("should not go below 0 with previousStep", () => {
   store.getState().previousStep();

   expect(store.getState().currentStep).toBe(0);
  });

  test("should stay at 0 after multiple previousStep from start", () => {
   store.getState().previousStep();
   store.getState().previousStep();
   store.getState().previousStep();

   expect(store.getState().currentStep).toBe(0);
  });
 });

 describe("step data", () => {
  test("should set step data", () => {
   store.getState().setStepData({ username: "johndoe" });

   expect(store.getState().data).toEqual({ username: "johndoe" });
  });

  test("should merge step data", () => {
   store.getState().setStepData({ username: "johndoe" });
   store.getState().setStepData({ displayName: "John" });

   expect(store.getState().data).toEqual({
    username: "johndoe",
    displayName: "John",
   });
  });

  test("should overwrite existing keys", () => {
   store.getState().setStepData({ username: "johndoe" });
   store.getState().setStepData({ username: "janedoe" });

   expect(store.getState().data.username).toBe("janedoe");
  });

  test("should handle nested data", () => {
   store.getState().setStepData({
    preferences: { theme: "dark", notifications: true },
   });

   expect(store.getState().data.preferences).toEqual({
    theme: "dark",
    notifications: true,
   });
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
   store.getState().setError("Something went wrong");

   expect(store.getState().error).toBe("Something went wrong");
  });

  test("should clear error with null", () => {
   store.getState().setError("Error");
   store.getState().setError(null);

   expect(store.getState().error).toBeNull();
  });
 });

 describe("reset", () => {
  test("should reset all state to initial", () => {
   // Modify all state
   store.getState().nextStep();
   store.getState().nextStep();
   store.getState().setStepData({ username: "test" });
   store.getState().setLoading(true);
   store.getState().setError("Error");

   // Reset
   store.getState().reset();

   // Verify all back to initial
   expect(store.getState().currentStep).toBe(0);
   expect(store.getState().data).toEqual({});
   expect(store.getState().isLoading).toBe(false);
   expect(store.getState().error).toBeNull();
  });
 });

 describe("store isolation", () => {
  test("should create independent store instances", () => {
   const store1 = createOnboardingStore();
   const store2 = createOnboardingStore();

   store1.getState().nextStep();
   store1.getState().setStepData({ name: "Store 1" });

   expect(store1.getState().currentStep).toBe(1);
   expect(store2.getState().currentStep).toBe(0);
   expect(store2.getState().data).toEqual({});
  });
 });
});
