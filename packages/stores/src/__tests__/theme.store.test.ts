/**
 * Theme Store Tests
 *
 * Tests follow the Arrange-Act-Assert pattern.
 * Each test describes a single behavior.
 */

import { describe, it, expect, mock } from "bun:test";
import { createThemeStore, type Theme } from "../theme.store";
import type { ProfileApiClient } from "@profile/api-client";

// Test fixture factory
const createMockTheme = (overrides: Partial<Theme> = {}): Theme => ({
 id: "theme-1",
 name: "Default Theme",
 description: "A default theme for testing",
 category: "professional",
 status: "approved",
 styleConfig: {},
 tags: ["modern", "clean"],
 authorId: "user-1",
 parentThemeId: null,
 isSystem: false,
 usageCount: 0,
 rating: null,
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString(),
 ...overrides,
});

const createMockApiClient = (
 overrides: Partial<ProfileApiClient["themes"]> = {}
) => {
 const mockTheme = createMockTheme();
 return {
  themes: {
   getAll: mock(() => Promise.resolve([mockTheme])),
   getById: mock(() => Promise.resolve(mockTheme)),
   getMyThemes: mock(() => Promise.resolve([mockTheme])),
   getSystem: mock(() =>
    Promise.resolve([createMockTheme({ isSystem: true })])
   ),
   getPopular: mock(() => Promise.resolve([mockTheme])),
   create: mock((data: any) =>
    Promise.resolve(createMockTheme({ ...data, id: "new-theme" }))
   ),
   update: mock((id: string, data: any) =>
    Promise.resolve(createMockTheme({ id, ...data }))
   ),
   delete: mock(() => Promise.resolve()),
   fork: mock((_id: string, name: string) =>
    Promise.resolve(createMockTheme({ name, id: "forked-theme" }))
   ),
   apply: mock(() => Promise.resolve()),
   submitForApproval: mock(() => Promise.resolve()),
   getPendingApprovals: mock(() => Promise.resolve([])),
   approve: mock(() => Promise.resolve()),
   reject: mock(() => Promise.resolve()),
   ...overrides,
  },
 } as unknown as ProfileApiClient;
};

describe("ThemeStore", () => {
 describe("Initial State", () => {
  it("should have empty themes arrays", () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);
   const state = useStore.getState();

   expect(state.themes).toEqual([]);
   expect(state.myThemes).toEqual([]);
   expect(state.systemThemes).toEqual([]);
   expect(state.popularThemes).toEqual([]);
  });

  it("should have null current theme", () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);

   expect(useStore.getState().currentTheme).toBeNull();
  });
 });

 describe("fetchThemes", () => {
  it("should populate themes from API", async () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);

   await useStore.getState().fetchThemes();

   expect(useStore.getState().themes).toHaveLength(1);
  });

  it("should pass query params to API", async () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);

   await useStore.getState().fetchThemes({ category: "professional" });

   expect(apiClient.themes.getAll).toHaveBeenCalledWith({
    category: "professional",
   });
  });

  it("should set error on failure", async () => {
   const apiClient = createMockApiClient({
    getAll: mock(() => Promise.reject(new Error("API Error"))),
   });
   const useStore = createThemeStore(apiClient);

   await expect(useStore.getState().fetchThemes()).rejects.toThrow();

   expect(useStore.getState().error).toBe("API Error");
  });
 });

 describe("fetchMyThemes", () => {
  it("should populate my themes", async () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);

   await useStore.getState().fetchMyThemes();

   expect(useStore.getState().myThemes).toHaveLength(1);
  });
 });

 describe("fetchSystemThemes", () => {
  it("should populate system themes", async () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);

   await useStore.getState().fetchSystemThemes();

   expect(useStore.getState().systemThemes).toHaveLength(1);
   expect(useStore.getState().systemThemes[0].isSystem).toBe(true);
  });
 });

 describe("createTheme", () => {
  it("should add theme to myThemes", async () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);

   await useStore.getState().createTheme({
    name: "New Theme",
    category: "creative",
    styleConfig: {},
   });

   expect(useStore.getState().myThemes).toHaveLength(1);
  });

  it("should return created theme", async () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);

   const result = await useStore.getState().createTheme({
    name: "New Theme",
    category: "creative",
    styleConfig: {},
   });

   expect(result.name).toBe("New Theme");
  });

  it("should set as current theme", async () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);

   await useStore.getState().createTheme({
    name: "New Theme",
    category: "creative",
    styleConfig: {},
   });

   expect(useStore.getState().currentTheme).toBeDefined();
  });
 });

 describe("forkTheme", () => {
  it("should create a forked theme", async () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);

   const result = await useStore.getState().forkTheme("theme-1", "My Fork");

   expect(result.id).toBe("forked-theme");
   expect(apiClient.themes.fork).toHaveBeenCalledWith("theme-1", "My Fork");
  });

  it("should add forked theme to myThemes", async () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);

   await useStore.getState().forkTheme("theme-1", "My Fork");

   expect(useStore.getState().myThemes).toHaveLength(1);
  });
 });

 describe("updateTheme", () => {
  it("should update theme in myThemes", async () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);

   // Setup initial state
   useStore.getState().setThemes([createMockTheme()]);

   await useStore.getState().updateTheme("theme-1", { name: "Updated Name" });

   expect(apiClient.themes.update).toHaveBeenCalledWith("theme-1", {
    name: "Updated Name",
   });
  });
 });

 describe("deleteTheme", () => {
  it("should remove theme from myThemes", async () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);

   // Add theme first
   const store = useStore.getState();
   store.setThemes([createMockTheme()]);

   await useStore.getState().deleteTheme("theme-1");

   expect(
    useStore.getState().myThemes.find((t) => t.id === "theme-1")
   ).toBeUndefined();
  });

  it("should clear current theme if deleted", async () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);

   const theme = createMockTheme();
   useStore.getState().setCurrentTheme(theme);

   await useStore.getState().deleteTheme("theme-1");

   expect(useStore.getState().currentTheme).toBeNull();
  });
 });

 describe("applyToResume", () => {
  it("should call API with correct params", async () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);

   await useStore.getState().applyToResume("resume-1", "theme-1");

   expect(apiClient.themes.apply).toHaveBeenCalledWith({
    resumeId: "resume-1",
    themeId: "theme-1",
   });
  });
 });

 describe("Approval Workflow", () => {
  it("should submit theme for approval", async () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);

   await useStore.getState().submitForApproval("theme-1");

   expect(apiClient.themes.submitForApproval).toHaveBeenCalledWith("theme-1");
  });

  it("should fetch pending approvals", async () => {
   const pendingTheme = createMockTheme({ status: "pending" });
   const apiClient = createMockApiClient({
    getPendingApprovals: mock(() => Promise.resolve([pendingTheme])),
   });
   const useStore = createThemeStore(apiClient);

   await useStore.getState().fetchPendingApprovals();

   expect(useStore.getState().pendingApprovals).toHaveLength(1);
  });

  it("should approve theme", async () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);

   await useStore.getState().approveTheme("theme-1");

   expect(apiClient.themes.approve).toHaveBeenCalledWith("theme-1");
  });

  it("should reject theme with reason", async () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);

   await useStore.getState().rejectTheme("theme-1", "Does not meet guidelines");

   expect(apiClient.themes.reject).toHaveBeenCalledWith(
    "theme-1",
    "Does not meet guidelines"
   );
  });
 });

 describe("clearError", () => {
  it("should set error to null", () => {
   const apiClient = createMockApiClient();
   const useStore = createThemeStore(apiClient);

   useStore.getState().setError("Some error");
   useStore.getState().clearError();

   expect(useStore.getState().error).toBeNull();
  });
 });
});
