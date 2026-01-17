/**
 * Theme Repository Tests
 *
 * Decision: Tests cover both public and authenticated endpoints.
 * Theme repository has query params, pagination, and approval workflow.
 *
 * Pattern: Test URL construction with query params carefully.
 */

import { describe, it, expect, beforeEach, mock } from "bun:test";
import { createThemeRepository } from "../repositories/theme.repository";
import type { HttpClient } from "../client";
import type { Theme } from "../types";

// ============================================================================
// Mock Factory
// ============================================================================

function createMockHttpClient(): HttpClient {
 return {
  get: mock(() => Promise.resolve({})),
  post: mock(() => Promise.resolve({})),
  put: mock(() => Promise.resolve({})),
  patch: mock(() => Promise.resolve({})),
  delete: mock(() => Promise.resolve(undefined)),
  setToken: mock(() => {}),
  clearToken: mock(() => {}),
 };
}

function createMockTheme(overrides: Partial<Theme> = {}): Theme {
 return {
  id: "theme-123",
  name: "Modern Dark",
  description: "A modern dark theme",
  isPublic: true,
  isSystem: false,
  forksCount: 0,
  usageCount: 0,
  userId: "user-123",
  colors: {
   primary: "#007AFF",
   secondary: "#5856D6",
   background: "#1C1C1E",
   text: "#FFFFFF",
  },
  typography: {
   fontFamily: "Inter",
   fontSize: 16,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
 } as Theme;
}

// ============================================================================
// Tests
// ============================================================================

describe("ThemeRepository", () => {
 let client: HttpClient;
 let repository: ReturnType<typeof createThemeRepository>;

 beforeEach(() => {
  client = createMockHttpClient();
  repository = createThemeRepository(client);
 });

 // ==========================================================================
 // Public Endpoints
 // ==========================================================================

 describe("getAll", () => {
  it("calls GET /themes without params", async () => {
   // Arrange
   const themes = [createMockTheme()];
   (client.get as ReturnType<typeof mock>).mockResolvedValue(themes);

   // Act
   const result = await repository.getAll();

   // Assert
   expect(client.get).toHaveBeenCalledWith("/v1/themes");
   expect(result).toEqual(themes);
  });

  it("calls GET /themes with query params", async () => {
   // Arrange
   const themes = [createMockTheme()];
   (client.get as ReturnType<typeof mock>).mockResolvedValue(themes);

   // Act
   await repository.getAll({ isPublic: "true", isSystem: "false" } as any);

   // Assert
   const calledUrl = (client.get as ReturnType<typeof mock>).mock.calls[0][0];
   expect(calledUrl).toContain("/v1/themes?");
   expect(calledUrl).toContain("isPublic=true");
  });
 });

 describe("getById", () => {
  it("calls GET /themes/:id", async () => {
   // Arrange
   const theme = createMockTheme();
   (client.get as ReturnType<typeof mock>).mockResolvedValue(theme);

   // Act
   const result = await repository.getById("theme-123");

   // Assert
   expect(client.get).toHaveBeenCalledWith("/v1/themes/theme-123");
   expect(result).toEqual(theme);
  });
 });

 describe("getPopular", () => {
  it("calls GET /themes/popular with default limit", async () => {
   // Arrange
   const themes = [createMockTheme({ usageCount: 100 })];
   (client.get as ReturnType<typeof mock>).mockResolvedValue(themes);

   // Act
   await repository.getPopular();

   // Assert
   expect(client.get).toHaveBeenCalledWith("/v1/themes/popular?limit=10");
  });

  it("calls GET /themes/popular with custom limit", async () => {
   // Arrange
   (client.get as ReturnType<typeof mock>).mockResolvedValue([]);

   // Act
   await repository.getPopular(5);

   // Assert
   expect(client.get).toHaveBeenCalledWith("/v1/themes/popular?limit=5");
  });
 });

 describe("getSystem", () => {
  it("calls GET /themes/system", async () => {
   // Arrange
   const systemThemes = [createMockTheme({ isSystem: true, name: "Default" })];
   (client.get as ReturnType<typeof mock>).mockResolvedValue(systemThemes);

   // Act
   const result = await repository.getSystem();

   // Assert
   expect(client.get).toHaveBeenCalledWith("/v1/themes/system");
   expect(result[0].isSystem).toBe(true);
  });
 });

 // ==========================================================================
 // Authenticated Endpoints
 // ==========================================================================

 describe("getMyThemes", () => {
  it("calls GET /themes/me", async () => {
   // Arrange
   const myThemes = [createMockTheme()];
   (client.get as ReturnType<typeof mock>).mockResolvedValue(myThemes);

   // Act
   const result = await repository.getMyThemes();

   // Assert
   expect(client.get).toHaveBeenCalledWith("/v1/themes/me");
   expect(result).toEqual(myThemes);
  });
 });

 describe("create", () => {
  it("calls POST /themes with data", async () => {
   // Arrange
   const createData = {
    name: "New Theme",
    isPublic: false,
    colors: { primary: "#FF0000" },
   };
   const theme = createMockTheme({ name: "New Theme", isPublic: false });
   (client.post as ReturnType<typeof mock>).mockResolvedValue(theme);

   // Act
   const result = await repository.create(createData as any);

   // Assert
   expect(client.post).toHaveBeenCalledWith("/v1/themes", createData);
   expect(result.name).toBe("New Theme");
  });
 });

 describe("update", () => {
  it("calls PUT /themes/:id with data", async () => {
   // Arrange
   const updateData = { name: "Updated Theme" };
   const theme = createMockTheme({ name: "Updated Theme" });
   (client.put as ReturnType<typeof mock>).mockResolvedValue(theme);

   // Act
   const result = await repository.update("theme-123", updateData as any);

   // Assert
   expect(client.put).toHaveBeenCalledWith("/v1/themes/theme-123", updateData);
   expect(result.name).toBe("Updated Theme");
  });
 });

 describe("delete", () => {
  it("calls DELETE /themes/:id", async () => {
   // Arrange
   (client.delete as ReturnType<typeof mock>).mockResolvedValue(undefined);

   // Act
   await repository.delete("theme-123");

   // Assert
   expect(client.delete).toHaveBeenCalledWith("/v1/themes/theme-123");
  });
 });

 describe("fork", () => {
  it("calls POST /themes/fork with themeId and name", async () => {
   // Arrange
   const forkedTheme = createMockTheme({ id: "theme-456", name: "My Fork" });
   (client.post as ReturnType<typeof mock>).mockResolvedValue(forkedTheme);

   // Act
   const result = await repository.fork("theme-123", "My Fork");

   // Assert
   expect(client.post).toHaveBeenCalledWith("/v1/themes/fork", {
    themeId: "theme-123",
    name: "My Fork",
   });
   expect(result.name).toBe("My Fork");
  });
 });

 describe("apply", () => {
  it("calls POST /themes/apply with themeId and resumeId", async () => {
   // Arrange
   (client.post as ReturnType<typeof mock>).mockResolvedValue(undefined);

   // Act
   await repository.apply({ themeId: "theme-123", resumeId: "resume-456" });

   // Assert
   expect(client.post).toHaveBeenCalledWith("/v1/themes/apply", {
    themeId: "theme-123",
    resumeId: "resume-456",
   });
  });
 });
});
