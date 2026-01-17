/**
 * Onboarding Store Tests
 *
 * Tests behavior, not implementation details.
 * Each test is independent and self-documenting.
 */

import { describe, it, expect, mock } from "bun:test";
import { createOnboardingStore } from "../onboarding.store";
import type { ProfileApiClient } from "@profile/api-client";

const createMockApiClient = (
 overrides: Partial<ProfileApiClient["onboarding"]> = {}
) => {
 return {
  onboarding: {
   getStatus: mock(() =>
    Promise.resolve({
     hasCompletedOnboarding: false,
     currentStep: 1,
     totalSteps: 5,
    })
   ),
   getProgress: mock(() =>
    Promise.resolve({
     currentStep: 2,
     data: { name: "Test User" },
     completedSteps: [1],
    })
   ),
   saveProgress: mock(() => Promise.resolve()),
   submit: mock(() => Promise.resolve()),
   skip: mock(() => Promise.resolve()),
   ...overrides,
  },
 } as unknown as ProfileApiClient;
};

describe("OnboardingStore", () => {
 describe("Initial State", () => {
  it("should have null status when created", () => {
   const apiClient = createMockApiClient();
   const useStore = createOnboardingStore(apiClient);

   expect(useStore.getState().status).toBeNull();
  });

  it("should have null progress when created", () => {
   const apiClient = createMockApiClient();
   const useStore = createOnboardingStore(apiClient);

   expect(useStore.getState().progress).toBeNull();
  });

  it("should not be loading initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createOnboardingStore(apiClient);

   expect(useStore.getState().isLoading).toBe(false);
  });

  it("should have no error initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createOnboardingStore(apiClient);

   expect(useStore.getState().error).toBeNull();
  });
 });

 describe("setLoading", () => {
  it("should update loading state", () => {
   const apiClient = createMockApiClient();
   const useStore = createOnboardingStore(apiClient);

   useStore.getState().setLoading(true);

   expect(useStore.getState().isLoading).toBe(true);
  });
 });

 describe("setError / clearError", () => {
  it("should set error message", () => {
   const apiClient = createMockApiClient();
   const useStore = createOnboardingStore(apiClient);

   useStore.getState().setError("Something went wrong");

   expect(useStore.getState().error).toBe("Something went wrong");
  });

  it("should clear error message", () => {
   const apiClient = createMockApiClient();
   const useStore = createOnboardingStore(apiClient);

   useStore.getState().setError("Error");
   useStore.getState().clearError();

   expect(useStore.getState().error).toBeNull();
  });
 });

 describe("fetchStatus", () => {
  it("should fetch and store onboarding status", async () => {
   const apiClient = createMockApiClient();
   const useStore = createOnboardingStore(apiClient);

   const result = await useStore.getState().fetchStatus();

   expect(result.hasCompletedOnboarding).toBe(false);
   expect(result.currentStep).toBe(1);
   expect(result.totalSteps).toBe(5);
   expect(useStore.getState().status).toEqual(result);
   expect(useStore.getState().isLoading).toBe(false);
  });

  it("should handle fetch status error", async () => {
   const apiClient = createMockApiClient({
    getStatus: mock(() => Promise.reject(new Error("Network error"))),
   });
   const useStore = createOnboardingStore(apiClient);

   await expect(useStore.getState().fetchStatus()).rejects.toThrow(
    "Network error"
   );
   expect(useStore.getState().error).toBe("Network error");
   expect(useStore.getState().isLoading).toBe(false);
  });
 });

 describe("fetchProgress", () => {
  it("should fetch and store onboarding progress", async () => {
   const apiClient = createMockApiClient();
   const useStore = createOnboardingStore(apiClient);

   const result = await useStore.getState().fetchProgress();

   expect(result.currentStep).toBe(2);
   expect(result.completedSteps).toEqual([1]);
   expect(useStore.getState().progress).toEqual(result);
  });

  it("should handle fetch progress error", async () => {
   const apiClient = createMockApiClient({
    getProgress: mock(() => Promise.reject(new Error("Server error"))),
   });
   const useStore = createOnboardingStore(apiClient);

   await expect(useStore.getState().fetchProgress()).rejects.toThrow(
    "Server error"
   );
   expect(useStore.getState().error).toBe("Server error");
  });
 });

 describe("saveProgress", () => {
  it("should save progress data", async () => {
   const apiClient = createMockApiClient();
   const useStore = createOnboardingStore(apiClient);
   const progressData = {
    currentStep: 3,
    data: { skills: ["TypeScript"] },
    completedSteps: [1, 2],
   };

   await useStore.getState().saveProgress(progressData);

   expect(apiClient.onboarding.saveProgress).toHaveBeenCalledWith(progressData);
   expect(useStore.getState().progress).toEqual(progressData);
   expect(useStore.getState().isLoading).toBe(false);
  });

  it("should handle save progress error", async () => {
   const apiClient = createMockApiClient({
    saveProgress: mock(() => Promise.reject(new Error("Save failed"))),
   });
   const useStore = createOnboardingStore(apiClient);

   await expect(
    useStore.getState().saveProgress({
     currentStep: 1,
     data: {},
     completedSteps: [],
    })
   ).rejects.toThrow("Save failed");
   expect(useStore.getState().error).toBe("Save failed");
  });
 });

 describe("submit", () => {
  it("should submit onboarding and mark as complete", async () => {
   const apiClient = createMockApiClient();
   const useStore = createOnboardingStore(apiClient);
   const submitData = { finalData: "complete" };

   await useStore.getState().submit(submitData);

   expect(apiClient.onboarding.submit).toHaveBeenCalledWith(submitData);
   expect(useStore.getState().status?.hasCompletedOnboarding).toBe(true);
   expect(useStore.getState().progress).toBeNull();
  });

  it("should handle submit error", async () => {
   const apiClient = createMockApiClient({
    submit: mock(() => Promise.reject(new Error("Submit failed"))),
   });
   const useStore = createOnboardingStore(apiClient);

   await expect(useStore.getState().submit({})).rejects.toThrow(
    "Submit failed"
   );
   expect(useStore.getState().error).toBe("Submit failed");
  });
 });

 describe("skip", () => {
  it("should skip onboarding and mark as complete", async () => {
   const apiClient = createMockApiClient();
   const useStore = createOnboardingStore(apiClient);

   await useStore.getState().skip();

   expect(apiClient.onboarding.skip).toHaveBeenCalled();
   expect(useStore.getState().status?.hasCompletedOnboarding).toBe(true);
   expect(useStore.getState().progress).toBeNull();
  });

  it("should handle skip error", async () => {
   const apiClient = createMockApiClient({
    skip: mock(() => Promise.reject(new Error("Skip failed"))),
   });
   const useStore = createOnboardingStore(apiClient);

   await expect(useStore.getState().skip()).rejects.toThrow("Skip failed");
   expect(useStore.getState().error).toBe("Skip failed");
  });
 });

 describe("goToStep", () => {
  it("should update current step in progress", () => {
   const apiClient = createMockApiClient();
   const useStore = createOnboardingStore(apiClient);

   // Set initial progress
   useStore.setState({
    progress: { currentStep: 1, data: {}, completedSteps: [] },
   });

   useStore.getState().goToStep(3);

   expect(useStore.getState().progress?.currentStep).toBe(3);
  });
 });

 describe("completeStep", () => {
  it("should add step to completed steps", () => {
   const apiClient = createMockApiClient();
   const useStore = createOnboardingStore(apiClient);

   useStore.setState({
    progress: { currentStep: 2, data: {}, completedSteps: [1] },
   });

   useStore.getState().completeStep(2);

   expect(useStore.getState().progress?.completedSteps).toContain(2);
  });

  it("should not duplicate completed steps", () => {
   const apiClient = createMockApiClient();
   const useStore = createOnboardingStore(apiClient);

   useStore.setState({
    progress: { currentStep: 2, data: {}, completedSteps: [1, 2] },
   });

   useStore.getState().completeStep(2);

   const completedSteps = useStore.getState().progress?.completedSteps || [];
   const countOfTwo = completedSteps.filter((s) => s === 2).length;
   expect(countOfTwo).toBe(1);
  });
 });

 describe("updateStepData", () => {
  it("should merge new data with existing progress data", () => {
   const apiClient = createMockApiClient();
   const useStore = createOnboardingStore(apiClient);

   useStore.setState({
    progress: {
     currentStep: 1,
     data: { name: "John" },
     completedSteps: [],
    },
   });

   useStore.getState().updateStepData({ email: "john@example.com" });

   expect(useStore.getState().progress?.data).toEqual({
    name: "John",
    email: "john@example.com",
   });
  });
 });
});
