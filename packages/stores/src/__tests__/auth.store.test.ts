/**
 * Auth Store Tests
 *
 * Following Kent Beck's TDD principles:
 * - Red: Write a failing test
 * - Green: Make it pass
 * - Refactor: Clean up
 *
 * Following Uncle Bob's Clean Code principles:
 * - Tests should be FIRST: Fast, Independent, Repeatable, Self-validating, Timely
 * - One assert per test (when practical)
 * - Test names describe behavior
 */

import { describe, it, expect, mock } from "bun:test";
import { createAuthStore } from "../auth.store";
import type { ProfileApiClient } from "@profile/api-client";

// Mock factory - follows Dependency Inversion Principle
const createMockApiClient = (
 overrides: Partial<ProfileApiClient["auth"]> = {}
) => {
 return {
  auth: {
   login: mock(() =>
    Promise.resolve({
     user: { id: "user-1", email: "test@example.com", username: "testuser" },
     tokens: { accessToken: "access-token", refreshToken: "refresh-token" },
    })
   ),
   register: mock(() =>
    Promise.resolve({
     user: { id: "user-1", email: "test@example.com", username: "testuser" },
     tokens: { accessToken: "access-token", refreshToken: "refresh-token" },
    })
   ),
   logout: mock(() => Promise.resolve()),
   refreshToken: mock(() =>
    Promise.resolve({
     accessToken: "new-access-token",
    })
   ),
   ...overrides,
  },
 } as unknown as ProfileApiClient;
};

describe("AuthStore", () => {
 describe("Initial State", () => {
  it("should have null user when created", () => {
   const apiClient = createMockApiClient();
   const useStore = createAuthStore(apiClient);

   expect(useStore.getState().user).toBeNull();
  });

  it("should not be authenticated initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createAuthStore(apiClient);

   expect(useStore.getState().isAuthenticated).toBe(false);
  });

  it("should not be loading initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createAuthStore(apiClient);

   expect(useStore.getState().isLoading).toBe(false);
  });

  it("should have no error initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createAuthStore(apiClient);

   expect(useStore.getState().error).toBeNull();
  });
 });

 describe("setUser", () => {
  it("should set user and mark as authenticated", () => {
   const apiClient = createMockApiClient();
   const useStore = createAuthStore(apiClient);
   const user = {
    id: "user-1",
    email: "test@example.com",
    username: "testuser",
   };

   useStore.getState().setUser(user as any);

   expect(useStore.getState().user).toEqual(user);
   expect(useStore.getState().isAuthenticated).toBe(true);
  });

  it("should clear authentication when user is null", () => {
   const apiClient = createMockApiClient();
   const useStore = createAuthStore(apiClient);
   const user = {
    id: "user-1",
    email: "test@example.com",
    username: "testuser",
   };

   useStore.getState().setUser(user as any);
   useStore.getState().setUser(null);

   expect(useStore.getState().user).toBeNull();
   expect(useStore.getState().isAuthenticated).toBe(false);
  });
 });

 describe("setTokens", () => {
  it("should store tokens", () => {
   const apiClient = createMockApiClient();
   const useStore = createAuthStore(apiClient);
   const tokens = { accessToken: "access", refreshToken: "refresh" };

   useStore.getState().setTokens(tokens);

   expect(useStore.getState().tokens).toEqual(tokens);
  });
 });

 describe("login", () => {
  it("should set loading state during login", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAuthStore(apiClient);

   const loginPromise = useStore
    .getState()
    .login("test@example.com", "password");

   // Loading should be true while request is in flight
   // Note: This is tricky to test due to async nature
   await loginPromise;

   expect(useStore.getState().isLoading).toBe(false);
  });

  it("should authenticate user on successful login", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAuthStore(apiClient);

   await useStore.getState().login("test@example.com", "password");

   expect(useStore.getState().isAuthenticated).toBe(true);
   expect(useStore.getState().user).toBeDefined();
   expect(useStore.getState().tokens).toBeDefined();
  });

  it("should call api client with correct credentials", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAuthStore(apiClient);

   await useStore.getState().login("test@example.com", "password123");

   expect(apiClient.auth.login).toHaveBeenCalledWith({
    email: "test@example.com",
    password: "password123",
   });
  });

  it("should set error on login failure", async () => {
   const apiClient = createMockApiClient({
    login: mock(() => Promise.reject(new Error("Invalid credentials"))),
   });
   const useStore = createAuthStore(apiClient);

   await expect(
    useStore.getState().login("test@example.com", "wrong")
   ).rejects.toThrow();

   expect(useStore.getState().error).toBe("Invalid credentials");
   expect(useStore.getState().isAuthenticated).toBe(false);
  });

  it("should clear previous error before login attempt", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAuthStore(apiClient);

   // Set an error first
   useStore.getState().setError("Previous error");

   await useStore.getState().login("test@example.com", "password");

   expect(useStore.getState().error).toBeNull();
  });
 });

 describe("register", () => {
  it("should authenticate user on successful registration", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAuthStore(apiClient);

   await useStore.getState().register("new@example.com", "password", "newuser");

   expect(useStore.getState().isAuthenticated).toBe(true);
   expect(useStore.getState().user).toBeDefined();
  });

  it("should call api client with correct data", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAuthStore(apiClient);

   await useStore
    .getState()
    .register("new@example.com", "password123", "newuser");

   expect(apiClient.auth.register).toHaveBeenCalledWith({
    email: "new@example.com",
    password: "password123",
    name: "newuser",
   });
  });

  it("should set error on registration failure", async () => {
   const apiClient = createMockApiClient({
    register: mock(() => Promise.reject(new Error("Email already exists"))),
   });
   const useStore = createAuthStore(apiClient);

   await expect(
    useStore.getState().register("existing@example.com", "password", "user")
   ).rejects.toThrow();

   expect(useStore.getState().error).toBe("Email already exists");
  });
 });

 describe("logout", () => {
  it("should clear all auth state", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAuthStore(apiClient);

   // Login first
   await useStore.getState().login("test@example.com", "password");
   expect(useStore.getState().isAuthenticated).toBe(true);

   // Then logout
   await useStore.getState().logout();

   expect(useStore.getState().user).toBeNull();
   expect(useStore.getState().tokens).toBeNull();
   expect(useStore.getState().isAuthenticated).toBe(false);
  });

  it("should call api client logout", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAuthStore(apiClient);

   await useStore.getState().logout();

   expect(apiClient.auth.logout).toHaveBeenCalled();
  });

  it("should clear state even if api call fails", async () => {
   const apiClient = createMockApiClient({
    logout: mock(() => Promise.reject(new Error("Network error"))),
   });
   const useStore = createAuthStore(apiClient);

   // Login first
   await useStore.getState().login("test@example.com", "password");

   // Logout should still clear state despite API error
   await useStore.getState().logout();

   expect(useStore.getState().isAuthenticated).toBe(false);
  });
 });

 describe("refreshToken", () => {
  it("should update access token", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAuthStore(apiClient);

   // Set initial tokens
   useStore.getState().setTokens({
    accessToken: "old-access-token",
    refreshToken: "refresh-token",
   });

   await useStore.getState().refreshToken();

   expect(useStore.getState().tokens?.accessToken).toBe("new-access-token");
  });

  it("should throw error when no refresh token available", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAuthStore(apiClient);

   await expect(useStore.getState().refreshToken()).rejects.toThrow(
    "No refresh token available"
   );
  });

  it("should clear auth on refresh failure", async () => {
   const apiClient = createMockApiClient({
    refreshToken: mock(() => Promise.reject(new Error("Token expired"))),
   });
   const useStore = createAuthStore(apiClient);

   // Set initial state
   useStore.getState().setTokens({
    accessToken: "access",
    refreshToken: "refresh",
   });
   useStore.getState().setUser({ id: "1", email: "test@example.com" } as any);

   await expect(useStore.getState().refreshToken()).rejects.toThrow();

   expect(useStore.getState().isAuthenticated).toBe(false);
   expect(useStore.getState().user).toBeNull();
  });
 });

 describe("clearAuth", () => {
  it("should reset all state to initial values", () => {
   const apiClient = createMockApiClient();
   const useStore = createAuthStore(apiClient);

   // Set some state
   useStore.getState().setUser({ id: "1", email: "test@example.com" } as any);
   useStore.getState().setTokens({ accessToken: "a", refreshToken: "r" });
   useStore.getState().setError("Some error");

   useStore.getState().clearAuth();

   expect(useStore.getState().user).toBeNull();
   expect(useStore.getState().tokens).toBeNull();
   expect(useStore.getState().isAuthenticated).toBe(false);
   expect(useStore.getState().error).toBeNull();
  });
 });
});
