/**
 * Advanced Sections Store Tests
 *
 * Tests the pure state management for custom resume sections.
 * Zustand stores are pure state containers - no side effects.
 */

import { describe, test, expect, beforeEach } from "bun:test";
import { createAdvancedSectionsStore } from "../advanced-sections.store";

describe("AdvancedSectionsStore (Pure State)", () => {
 let store: ReturnType<typeof createAdvancedSectionsStore>;

 beforeEach(() => {
  store = createAdvancedSectionsStore();
 });

 describe("initial state", () => {
  test("should initialize with empty sections", () => {
   expect(store.getState().sections).toEqual({});
  });

  test("should initialize with loading false", () => {
   expect(store.getState().isLoading).toBe(false);
  });

  test("should initialize with null error", () => {
   expect(store.getState().error).toBeNull();
  });
 });

 describe("setSections", () => {
  test("should set sections for a resume", () => {
   const resumeId = "resume-123";
   const sections = [
    { id: "1", title: "Awards", items: [] },
    { id: "2", title: "Publications", items: [] },
   ];

   store.getState().setSections(resumeId, sections as any);

   expect(store.getState().sections[resumeId]).toHaveLength(2);
  });

  test("should set sections for multiple resumes", () => {
   store.getState().setSections("resume-1", [{ id: "1" }] as any);
   store.getState().setSections("resume-2", [{ id: "2" }, { id: "3" }] as any);

   expect(store.getState().sections["resume-1"]).toHaveLength(1);
   expect(store.getState().sections["resume-2"]).toHaveLength(2);
  });

  test("should replace sections for same resume", () => {
   const resumeId = "resume-123";

   store.getState().setSections(resumeId, [{ id: "old" }] as any);
   store
    .getState()
    .setSections(resumeId, [{ id: "new-1" }, { id: "new-2" }] as any);

   expect(store.getState().sections[resumeId]).toHaveLength(2);
   expect((store.getState().sections[resumeId][0] as any).id).toBe("new-1");
  });

  test("should not affect other resumes when updating one", () => {
   store.getState().setSections("resume-1", [{ id: "a" }] as any);
   store.getState().setSections("resume-2", [{ id: "b" }] as any);

   // Update resume-1
   store.getState().setSections("resume-1", [{ id: "c" }, { id: "d" }] as any);

   // resume-2 should be unchanged
   expect(store.getState().sections["resume-2"]).toHaveLength(1);
   expect((store.getState().sections["resume-2"][0] as any).id).toBe("b");
  });

  test("should handle empty sections array", () => {
   const resumeId = "resume-123";

   store.getState().setSections(resumeId, [{ id: "1" }] as any);
   store.getState().setSections(resumeId, []);

   expect(store.getState().sections[resumeId]).toEqual([]);
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
   store.getState().setError("Failed to load sections");

   expect(store.getState().error).toBe("Failed to load sections");
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

 describe("store isolation", () => {
  test("should create independent store instances", () => {
   const store1 = createAdvancedSectionsStore();
   const store2 = createAdvancedSectionsStore();

   store1.getState().setSections("resume-1", [{ id: "1" }] as any);

   expect(Object.keys(store1.getState().sections)).toHaveLength(1);
   expect(Object.keys(store2.getState().sections)).toHaveLength(0);
  });
 });

 describe("section retrieval patterns", () => {
  test("should return undefined for non-existent resume", () => {
   expect(store.getState().sections["non-existent"]).toBeUndefined();
  });

  test("should allow checking if resume has sections", () => {
   store.getState().setSections("resume-1", [{ id: "1" }] as any);

   expect("resume-1" in store.getState().sections).toBe(true);
   expect("resume-2" in store.getState().sections).toBe(false);
  });
 });
});
