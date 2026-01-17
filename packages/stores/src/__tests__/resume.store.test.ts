/**
 * Resume Store Tests
 *
 * Tests describe observable behavior, not implementation details.
 * Each test is independent and can run in any order.
 */

import { describe, it, expect, mock } from "bun:test";
import { createResumeStore } from "../resume.store";
import type { ProfileApiClient } from "@profile/api-client";
import type { Resume } from "@octopus-synapse/profile-contracts";

// Test fixtures - reusable test data
const createMockResume = (overrides: Partial<Resume> = {}): Resume =>
 ({
  id: "resume-1",
  title: "My Resume",
  slug: "my-resume",
  userId: "user-1",
  isPublic: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
 }) as Resume;

// Mock factory - follows Single Responsibility Principle
const createMockApiClient = (
 overrides: Partial<ProfileApiClient["resumes"]> = {}
) => {
 const mockResume = createMockResume();
 // Track last update to return proper data
 let lastUpdatedResume = mockResume;
 return {
  resumes: {
   getAll: mock(() => Promise.resolve([lastUpdatedResume])),
   getById: mock(() => Promise.resolve(lastUpdatedResume)),
   create: mock((data: any) =>
    Promise.resolve(createMockResume({ ...data, id: "new-resume-id" }))
   ),
   update: mock((id: string, data: any) => {
    lastUpdatedResume = createMockResume({ id, ...lastUpdatedResume, ...data });
    return Promise.resolve(lastUpdatedResume);
   }),
   delete: mock(() => Promise.resolve()),
   ...overrides,
  },
 } as unknown as ProfileApiClient;
};

describe("ResumeStore", () => {
 describe("Initial State", () => {
  it("should have empty resumes array", () => {
   const apiClient = createMockApiClient();
   const useStore = createResumeStore(apiClient);

   expect(useStore.getState().resumes).toEqual([]);
  });

  it("should have null current resume", () => {
   const apiClient = createMockApiClient();
   const useStore = createResumeStore(apiClient);

   expect(useStore.getState().currentResume).toBeNull();
  });

  it("should not be loading", () => {
   const apiClient = createMockApiClient();
   const useStore = createResumeStore(apiClient);

   expect(useStore.getState().isLoading).toBe(false);
  });
 });

 describe("fetchResumes", () => {
  it("should populate resumes from API", async () => {
   const apiClient = createMockApiClient();
   const useStore = createResumeStore(apiClient);

   await useStore.getState().fetchResumes();

   expect(useStore.getState().resumes).toHaveLength(1);
   expect(useStore.getState().resumes[0].id).toBe("resume-1");
  });

  it("should set error on failure", async () => {
   const apiClient = createMockApiClient({
    getAll: mock(() => Promise.reject(new Error("Network error"))),
   });
   const useStore = createResumeStore(apiClient);

   await expect(useStore.getState().fetchResumes()).rejects.toThrow();

   expect(useStore.getState().error).toBe("Network error");
  });

  it("should clear error before fetching", async () => {
   const apiClient = createMockApiClient();
   const useStore = createResumeStore(apiClient);

   useStore.getState().setError("Previous error");

   await useStore.getState().fetchResumes();

   expect(useStore.getState().error).toBeNull();
  });
 });

 describe("fetchResume", () => {
  it("should set current resume from API", async () => {
   const apiClient = createMockApiClient();
   const useStore = createResumeStore(apiClient);

   await useStore.getState().fetchResume("resume-1");

   expect(useStore.getState().currentResume).toBeDefined();
   expect(useStore.getState().currentResume?.id).toBe("resume-1");
  });

  it("should call API with correct id", async () => {
   const apiClient = createMockApiClient();
   const useStore = createResumeStore(apiClient);

   await useStore.getState().fetchResume("specific-id");

   expect(apiClient.resumes.getById).toHaveBeenCalledWith("specific-id");
  });

  it("should clear current resume on error", async () => {
   const apiClient = createMockApiClient({
    getById: mock(() => Promise.reject(new Error("Not found"))),
   });
   const useStore = createResumeStore(apiClient);

   await expect(useStore.getState().fetchResume("invalid")).rejects.toThrow();

   expect(useStore.getState().currentResume).toBeNull();
  });
 });

 describe("createResume", () => {
  it("should add new resume to list", async () => {
   const apiClient = createMockApiClient();
   const useStore = createResumeStore(apiClient);

   await useStore
    .getState()
    .createResume({ title: "New Resume", slug: "new-resume" });

   expect(useStore.getState().resumes).toHaveLength(1);
  });

  it("should set new resume as current", async () => {
   const apiClient = createMockApiClient();
   const useStore = createResumeStore(apiClient);

   const result = await useStore.getState().createResume({
    title: "New Resume",
    slug: "new-resume",
   });

   expect(useStore.getState().currentResume).toEqual(result);
  });

  it("should return created resume", async () => {
   const apiClient = createMockApiClient();
   const useStore = createResumeStore(apiClient);

   const result = await useStore.getState().createResume({
    title: "New Resume",
    slug: "new-resume",
   });

   expect(result).toBeDefined();
   expect(result.title).toBe("New Resume");
  });

  it("should call API with correct data", async () => {
   const apiClient = createMockApiClient();
   const useStore = createResumeStore(apiClient);

   await useStore.getState().createResume({ title: "Test", slug: "test" });

   expect(apiClient.resumes.create).toHaveBeenCalledWith({
    title: "Test",
    slug: "test",
   });
  });
 });

 describe("updateResume", () => {
  it("should update resume in list", async () => {
   const apiClient = createMockApiClient();
   const useStore = createResumeStore(apiClient);

   // Add a resume first
   useStore.getState().setResumes([createMockResume()]);

   await useStore
    .getState()
    .updateResume("resume-1", { title: "Updated Title" });

   expect(useStore.getState().resumes[0].title).toBe("Updated Title");
  });

  it("should update current resume if it matches", async () => {
   const apiClient = createMockApiClient();
   const useStore = createResumeStore(apiClient);

   const resume = createMockResume();
   useStore.getState().setResumes([resume]);
   useStore.getState().setCurrentResume(resume);

   await useStore.getState().updateResume("resume-1", { title: "Updated" });

   expect(useStore.getState().currentResume?.title).toBe("Updated");
  });

  it("should not update current resume if different id", async () => {
   const apiClient = createMockApiClient();
   const useStore = createResumeStore(apiClient);

   const resume1 = createMockResume({ id: "resume-1" });
   const resume2 = createMockResume({ id: "resume-2", title: "Original" });
   useStore.getState().setResumes([resume1, resume2]);
   useStore.getState().setCurrentResume(resume2);

   await useStore.getState().updateResume("resume-1", { title: "Updated" });

   expect(useStore.getState().currentResume?.title).toBe("Original");
  });
 });

 describe("deleteResume", () => {
  it("should remove resume from list", async () => {
   const apiClient = createMockApiClient();
   const useStore = createResumeStore(apiClient);

   useStore
    .getState()
    .setResumes([
     createMockResume({ id: "resume-1" }),
     createMockResume({ id: "resume-2" }),
    ]);

   await useStore.getState().deleteResume("resume-1");

   expect(useStore.getState().resumes).toHaveLength(1);
   expect(useStore.getState().resumes[0].id).toBe("resume-2");
  });

  it("should clear current resume if deleted", async () => {
   const apiClient = createMockApiClient();
   const useStore = createResumeStore(apiClient);

   const resume = createMockResume();
   useStore.getState().setResumes([resume]);
   useStore.getState().setCurrentResume(resume);

   await useStore.getState().deleteResume("resume-1");

   expect(useStore.getState().currentResume).toBeNull();
  });

  it("should keep current resume if different id deleted", async () => {
   const apiClient = createMockApiClient();
   const useStore = createResumeStore(apiClient);

   const resume1 = createMockResume({ id: "resume-1" });
   const resume2 = createMockResume({ id: "resume-2" });
   useStore.getState().setResumes([resume1, resume2]);
   useStore.getState().setCurrentResume(resume2);

   await useStore.getState().deleteResume("resume-1");

   expect(useStore.getState().currentResume?.id).toBe("resume-2");
  });
 });

 describe("clearError", () => {
  it("should set error to null", () => {
   const apiClient = createMockApiClient();
   const useStore = createResumeStore(apiClient);

   useStore.getState().setError("Some error");
   useStore.getState().clearError();

   expect(useStore.getState().error).toBeNull();
  });
 });
});
