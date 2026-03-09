/**
 * Social Store Tests
 *
 * Tests the pure state management for social features (followers/following).
 * Zustand stores are pure state containers - no side effects.
 */

import { describe, test, expect, beforeEach } from "bun:test";
import { createSocialStore } from "../social.store";

describe("SocialStore (Pure State)", () => {
 let store: ReturnType<typeof createSocialStore>;

 beforeEach(() => {
  store = createSocialStore();
 });

 describe("initial state", () => {
  test("should initialize with empty followers", () => {
   expect(store.getState().followers).toEqual([]);
  });

  test("should initialize with empty following", () => {
   expect(store.getState().following).toEqual([]);
  });

  test("should initialize with loading false", () => {
   expect(store.getState().isLoading).toBe(false);
  });

  test("should initialize with null error", () => {
   expect(store.getState().error).toBeNull();
  });
 });

 describe("setFollowers", () => {
  test("should set followers array", () => {
   const followers = [
    { id: "1", username: "user1" },
    { id: "2", username: "user2" },
   ];

   store.getState().setFollowers(followers as any);

   expect(store.getState().followers).toHaveLength(2);
  });

  test("should replace existing followers", () => {
   store.getState().setFollowers([{ id: "1" }] as any);
   store.getState().setFollowers([{ id: "2" }, { id: "3" }] as any);

   expect(store.getState().followers).toHaveLength(2);
  });

  test("should handle empty array", () => {
   store.getState().setFollowers([{ id: "1" }] as any);
   store.getState().setFollowers([]);

   expect(store.getState().followers).toEqual([]);
  });
 });

 describe("setFollowing", () => {
  test("should set following array", () => {
   const following = [
    { id: "1", username: "user1" },
    { id: "2", username: "user2" },
   ];

   store.getState().setFollowing(following as any);

   expect(store.getState().following).toHaveLength(2);
  });

  test("should replace existing following", () => {
   store.getState().setFollowing([{ id: "1" }] as any);
   store.getState().setFollowing([{ id: "2" }] as any);

   expect(store.getState().following).toHaveLength(1);
   expect((store.getState().following[0] as any).id).toBe("2");
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
   store.getState().setError("Failed to load followers");

   expect(store.getState().error).toBe("Failed to load followers");
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
   store.getState().setFollowers([{ id: "1" }] as any);
   store.getState().setFollowing([{ id: "2" }] as any);
   store.getState().setLoading(true);
   store.getState().setError("Error");

   // Reset
   store.getState().reset();

   // Verify all back to initial
   expect(store.getState().followers).toEqual([]);
   expect(store.getState().following).toEqual([]);
   expect(store.getState().isLoading).toBe(false);
   expect(store.getState().error).toBeNull();
  });
 });

 describe("store isolation", () => {
  test("should create independent store instances", () => {
   const store1 = createSocialStore();
   const store2 = createSocialStore();

   store1.getState().setFollowers([{ id: "1" }] as any);
   store1.getState().setFollowing([{ id: "2" }] as any);

   expect(store1.getState().followers).toHaveLength(1);
   expect(store2.getState().followers).toHaveLength(0);
   expect(store2.getState().following).toHaveLength(0);
  });
 });

 describe("followers and following independence", () => {
  test("should manage followers and following independently", () => {
   const followers = [{ id: "follower-1" }];
   const following = [{ id: "following-1" }, { id: "following-2" }];

   store.getState().setFollowers(followers as any);
   store.getState().setFollowing(following as any);

   expect(store.getState().followers).toHaveLength(1);
   expect(store.getState().following).toHaveLength(2);

   // Modifying one shouldn't affect the other
   store.getState().setFollowers([]);
   expect(store.getState().following).toHaveLength(2);
  });
 });
});
