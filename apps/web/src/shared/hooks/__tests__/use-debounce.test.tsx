/**
 * useDebounce hook tests
 * Tests debounce behavior, not implementation details
 */

/**
 * useDebounce hook tests
 * Tests debounce behavior, not implementation details
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { renderHook } from "@testing-library/react";
import { useDebounce } from "../use-debounce";

describe("useDebounce", () => {
  beforeEach(() => {
    // Use fake timers for predictable testing
    if (typeof Bun !== "undefined") {
      // Bun doesn't have fake timers yet, so we'll use real delays
    }
  });

  afterEach(() => {
    // Cleanup
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("debounces value changes", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 100 },
      }
    );

    expect(result.current).toBe("initial");

    // Change value
    rerender({ value: "changed", delay: 100 });

    // Should still be initial (not debounced yet)
    expect(result.current).toBe("initial");

    // Wait for debounce
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Should now be changed
    expect(result.current).toBe("changed");
  });

  it("cancels previous debounce when value changes rapidly", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "value1", delay: 200 },
      }
    );

    // Rapid changes
    rerender({ value: "value2", delay: 200 });
    await new Promise((resolve) => setTimeout(resolve, 50));

    rerender({ value: "value3", delay: 200 });
    await new Promise((resolve) => setTimeout(resolve, 50));

    rerender({ value: "value4", delay: 200 });
    await new Promise((resolve) => setTimeout(resolve, 250));

    // Should be the last value, not intermediate ones
    expect(result.current).toBe("value4");
  });

  it("respects custom delay", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 50 },
      }
    );

    rerender({ value: "changed", delay: 50 });

    // Wait less than delay - should still be initial
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(result.current).toBe("initial");

    // Wait full delay - should be changed
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(result.current).toBe("changed");
  });

  it("uses default delay of 500ms when not provided", async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "initial" },
    });

    rerender({ value: "changed" });

    // Wait less than default delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(result.current).toBe("initial");

    // Wait full default delay
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(result.current).toBe("changed");
  });

  it("cleans up timeout on unmount", () => {
    const { unmount, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      {
        initialProps: { value: "initial" },
      }
    );

    rerender({ value: "changed" });
    unmount();

    // Should not throw or cause memory leaks
    // (This is more of a smoke test - hard to verify cleanup directly)
  });
});

