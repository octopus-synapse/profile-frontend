/**
 * Admin Store Tests
 *
 * Tests the pure state management for admin dashboard.
 * Zustand stores are pure state containers - no side effects.
 */

import { describe, test, expect, beforeEach } from "bun:test";
import { createAdminStore } from "../admin.store";
import type { PlatformStatsResponseDto } from "@profile/api-client";

// Helper to create valid mock stats
const createMockStats = (
 overrides: Partial<PlatformStatsResponseDto> = {},
): PlatformStatsResponseDto => ({
 totalUsers: 1000,
 totalResumes: 500,
 totalViews: 5000,
 activeUsersToday: 100,
 activeUsersWeek: 250,
 updatedAt: new Date().toISOString(),
 ...overrides,
});

describe("AdminStore (Pure State)", () => {
 let store: ReturnType<typeof createAdminStore>;

 beforeEach(() => {
  store = createAdminStore();
 });

 describe("initial state", () => {
  test("should initialize with null stats", () => {
   expect(store.getState().stats).toBeNull();
  });

  test("should initialize with empty users", () => {
   expect(store.getState().users).toEqual([]);
  });

  test("should initialize with loading false", () => {
   expect(store.getState().isLoading).toBe(false);
  });

  test("should initialize with null error", () => {
   expect(store.getState().error).toBeNull();
  });
 });

 describe("setStats", () => {
  test("should set dashboard stats", () => {
   const stats = createMockStats();

   store.getState().setStats(stats);

   expect(store.getState().stats).toEqual(stats);
  });

  test("should replace existing stats", () => {
   store.getState().setStats(createMockStats({ totalUsers: 100 }));
   store.getState().setStats(createMockStats({ totalUsers: 200 }));

   expect(store.getState().stats?.totalUsers).toBe(200);
  });
 });

 describe("setUsers", () => {
  test("should set users array", () => {
   const users = [
    { id: "1", email: "user1@example.com" },
    { id: "2", email: "user2@example.com" },
   ];

   store.getState().setUsers(users as any);

   expect(store.getState().users).toHaveLength(2);
  });

  test("should replace existing users", () => {
   store.getState().setUsers([{ id: "1" }] as any);
   store.getState().setUsers([{ id: "2" }, { id: "3" }] as any);

   expect(store.getState().users).toHaveLength(2);
  });

  test("should handle empty array", () => {
   store.getState().setUsers([{ id: "1" }] as any);
   store.getState().setUsers([]);

   expect(store.getState().users).toEqual([]);
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
   store.getState().setError("Access denied");

   expect(store.getState().error).toBe("Access denied");
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
   store.getState().setStats(createMockStats());
   store.getState().setUsers([{ id: "1" }] as any);
   store.getState().setLoading(true);
   store.getState().setError("Error");

   // Reset
   store.getState().reset();

   // Verify all back to initial
   expect(store.getState().stats).toBeNull();
   expect(store.getState().users).toEqual([]);
   expect(store.getState().isLoading).toBe(false);
   expect(store.getState().error).toBeNull();
  });
 });

 describe("admin dashboard flow", () => {
  test("should handle typical load flow", () => {
   // Start loading
   store.getState().setLoading(true);

   // Load stats and users
   store
    .getState()
    .setStats(createMockStats({ totalUsers: 500, totalResumes: 300 }));
   store.getState().setUsers([{ id: "1", email: "admin@example.com" }] as any);
   store.getState().setLoading(false);

   expect(store.getState().isLoading).toBe(false);
   expect(store.getState().stats).not.toBeNull();
   expect(store.getState().users).toHaveLength(1);
  });
 });

 describe("store isolation", () => {
  test("should create independent store instances", () => {
   const store1 = createAdminStore();
   const store2 = createAdminStore();

   store1.getState().setStats(createMockStats({ totalUsers: 100 }));

   expect(store1.getState().stats).not.toBeNull();
   expect(store2.getState().stats).toBeNull();
  });
 });
});
