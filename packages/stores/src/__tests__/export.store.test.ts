/**
 * Export Store Tests
 *
 * Tests the pure state management for resume export functionality.
 * Zustand stores are pure state containers - no side effects.
 */

import { describe, test, expect, beforeEach } from "bun:test";
import { createExportStore } from "../export.store";

describe("ExportStore (Pure State)", () => {
 let store: ReturnType<typeof createExportStore>;

 beforeEach(() => {
  store = createExportStore();
 });

 describe("initial state", () => {
  test("should initialize with null export format", () => {
   expect(store.getState().exportFormat).toBeNull();
  });

  test("should initialize with exporting false", () => {
   expect(store.getState().isExporting).toBe(false);
  });

  test("should initialize with null error", () => {
   expect(store.getState().error).toBeNull();
  });
 });

 describe("setExportFormat", () => {
  test("should set format to pdf", () => {
   store.getState().setExportFormat("pdf");

   expect(store.getState().exportFormat).toBe("pdf");
  });

  test("should set format to json", () => {
   store.getState().setExportFormat("json");

   expect(store.getState().exportFormat).toBe("json");
  });

  test("should set format to docx", () => {
   store.getState().setExportFormat("docx");

   expect(store.getState().exportFormat).toBe("docx");
  });

  test("should set format to null", () => {
   store.getState().setExportFormat("pdf");
   store.getState().setExportFormat(null);

   expect(store.getState().exportFormat).toBeNull();
  });

  test("should replace existing format", () => {
   store.getState().setExportFormat("pdf");
   store.getState().setExportFormat("json");

   expect(store.getState().exportFormat).toBe("json");
  });
 });

 describe("setExporting", () => {
  test("should set exporting to true", () => {
   store.getState().setExporting(true);

   expect(store.getState().isExporting).toBe(true);
  });

  test("should set exporting to false", () => {
   store.getState().setExporting(true);
   store.getState().setExporting(false);

   expect(store.getState().isExporting).toBe(false);
  });
 });

 describe("error handling", () => {
  test("should set error message", () => {
   store.getState().setError("Export failed");

   expect(store.getState().error).toBe("Export failed");
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
   store.getState().setExportFormat("pdf");
   store.getState().setExporting(true);
   store.getState().setError("Error");

   // Reset
   store.getState().reset();

   // Verify all back to initial
   expect(store.getState().exportFormat).toBeNull();
   expect(store.getState().isExporting).toBe(false);
   expect(store.getState().error).toBeNull();
  });
 });

 describe("export flow", () => {
  test("should handle typical export flow", () => {
   // User selects format
   store.getState().setExportFormat("pdf");
   expect(store.getState().exportFormat).toBe("pdf");

   // Export starts
   store.getState().setExporting(true);
   expect(store.getState().isExporting).toBe(true);

   // Export completes
   store.getState().setExporting(false);
   expect(store.getState().isExporting).toBe(false);
  });

  test("should handle export error flow", () => {
   // User selects format
   store.getState().setExportFormat("docx");

   // Export starts
   store.getState().setExporting(true);

   // Export fails
   store.getState().setError("Failed to generate DOCX");
   store.getState().setExporting(false);

   expect(store.getState().isExporting).toBe(false);
   expect(store.getState().error).toBe("Failed to generate DOCX");
   expect(store.getState().exportFormat).toBe("docx"); // Format preserved
  });
 });

 describe("store isolation", () => {
  test("should create independent store instances", () => {
   const store1 = createExportStore();
   const store2 = createExportStore();

   store1.getState().setExportFormat("pdf");
   store1.getState().setExporting(true);

   expect(store1.getState().exportFormat).toBe("pdf");
   expect(store2.getState().exportFormat).toBeNull();
   expect(store2.getState().isExporting).toBe(false);
  });
 });
});
