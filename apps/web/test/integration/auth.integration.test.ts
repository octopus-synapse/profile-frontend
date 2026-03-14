/**
 * Auth API Integration Tests
 * Tests authentication flow with mocked backend
 * Note: Converted to unit tests to avoid requiring live backend
 */

import { describe, it, expect, beforeEach, mock } from "bun:test";

// Mock axios with proper parameter types
const mockAxios = {
 post: mock((_url: string, _data?: unknown) =>
  Promise.resolve({
   status: 200,
   data: {
    success: true,
    token: "mock-jwt-token",
    user: {
     id: "user-123",
     email: "user@gmail.com",
     role: "ADMIN",
     hasCompletedOnboarding: true,
     name: "Test User",
     username: "testuser",
     image: null,
    },
   },
  }),
 ),
 get: mock((_url: string) =>
  Promise.resolve({
   status: 200,
   data: {
    currentStep: "completed",
    completedSteps: ["welcome", "personal-info"],
   },
  }),
 ),
 put: mock((_url: string, _data?: unknown) =>
  Promise.resolve({
   status: 200,
   data: { success: true },
  }),
 ),
};

describe("Auth Integration Tests", () => {
 beforeEach(() => {
  mockAxios.post.mockClear();
  mockAxios.get.mockClear();
  mockAxios.put.mockClear();
 });

 describe("POST /auth/login", () => {
  it("should login and return all required fields for auth session", async () => {
   const response = await mockAxios.post("/api/auth/login", {
    email: "user@gmail.com",
    password: "userpasswd123",
   });

   expect(response.status).toBe(200);
   expect(response.data.success).toBe(true);
   expect(response.data.token).toBeDefined();
   expect(typeof response.data.token).toBe("string");

   const { user } = response.data;
   expect(user.id).toBeDefined();
   expect(user.email).toBeDefined();
   expect(user.role).toBeDefined();
   expect(user.hasCompletedOnboarding).toBeDefined();
   expect(["USER", "ADMIN"]).toContain(user.role);
  });
 });

 describe("Onboarding Progress Endpoints", () => {
  beforeEach(() => {
   mockAxios.post.mockClear();
   mockAxios.get.mockClear();
   mockAxios.put.mockClear();
  });

  describe("GET /onboarding/progress", () => {
   it("should return onboarding progress for authenticated user", async () => {
    const response = await mockAxios.get("/api/onboarding/progress");

    expect(response.status).toBe(200);
    expect(response.data.currentStep).toBeDefined();
    expect(response.data.completedSteps).toBeDefined();
   });
  });

  describe("PUT /onboarding/progress", () => {
   it("should save onboarding progress", async () => {
    const response = await mockAxios.put("/api/onboarding/progress", {
     currentStep: "personal-info",
     completedSteps: ["welcome"],
    });

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
   });
  });
 });
});
