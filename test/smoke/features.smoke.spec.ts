/**
 * Features Package Smoke Tests - Kent Beck Style
 *
 * These tests verify that all feature hooks can be imported.
 * Hook functionality is tested in unit tests with DOM environment.
 */

import { describe, it, expect } from "bun:test";

describe("Smoke Tests - Features Package", () => {
 describe("Hook Imports", () => {
  it("should import useAuth hook", async () => {
   const { useAuth } =
    await import("../../packages/features/src/hooks/useAuth");
   expect(useAuth).toBeDefined();
   expect(typeof useAuth).toBe("function");
  });

  it("should import useResume hook", async () => {
   const { useResume } =
    await import("../../packages/features/src/hooks/useResume");
   expect(useResume).toBeDefined();
   expect(typeof useResume).toBe("function");
  });

  it("should import useTheme hook", async () => {
   const { useTheme } =
    await import("../../packages/features/src/hooks/useTheme");
   expect(useTheme).toBeDefined();
   expect(typeof useTheme).toBe("function");
  });

  it("should import useTwoFactor hook", async () => {
   const { useTwoFactor } =
    await import("../../packages/features/src/hooks/useTwoFactor");
   expect(useTwoFactor).toBeDefined();
   expect(typeof useTwoFactor).toBe("function");
  });
 });

 describe("Main Package Export", () => {
  it("should import main index without errors", async () => {
   const features = await import("../../packages/features/src/index");
   expect(features).toBeDefined();
  });
 });
});
