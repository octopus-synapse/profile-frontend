import { describe, test, expect } from "bun:test";
import { createAuthStore } from "../auth.store";
import type { CurrentUserResponseDto } from "@profile/api-client";

// Helper to create valid mock user
const createMockUser = (
 overrides: Partial<CurrentUserResponseDto> = {},
): CurrentUserResponseDto => ({
 id: "1",
 email: "test@example.com",
 role: "USER",
 emailVerified: true,
 username: "test",
 ...overrides,
});

describe("AuthStore (Pure State)", () => {
 test("should initialize with default state", () => {
  const useStore = createAuthStore();
  const state = useStore.getState();

  expect(state.user).toBeNull();
  expect(state.isAuthenticated).toBe(false);
  expect(state.isLoading).toBe(false);
  expect(state.error).toBeNull();
 });

 test("should set user", () => {
  const useStore = createAuthStore();
  const user = createMockUser();

  useStore.getState().setUser(user);

  expect(useStore.getState().user).toEqual(user);
 });

 test("should set authenticated state when user is set", () => {
  const useStore = createAuthStore();
  const user = createMockUser();

  useStore.getState().setUser(user);

  expect(useStore.getState().isAuthenticated).toBe(true);
 });

 test("should set loading state", () => {
  const useStore = createAuthStore();

  useStore.getState().setLoading(true);
  expect(useStore.getState().isLoading).toBe(true);

  useStore.getState().setLoading(false);
  expect(useStore.getState().isLoading).toBe(false);
 });

 test("should set error", () => {
  const useStore = createAuthStore();

  useStore.getState().setError("Login failed");

  expect(useStore.getState().error).toBe("Login failed");
 });

 test("should clear error", () => {
  const useStore = createAuthStore();

  useStore.getState().setError("Some error");
  useStore.getState().setError(null);

  expect(useStore.getState().error).toBeNull();
 });
});
