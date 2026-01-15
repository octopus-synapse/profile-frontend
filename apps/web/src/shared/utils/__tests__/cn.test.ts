/**
 * cn utility tests
 * Tests class name merging with Tailwind conflict resolution
 */

import { describe, it, expect } from "bun:test";
import { cn } from "../cn";

describe("cn", () => {
  it("merges simple class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    const showBar = true;
    const showBaz = false;
    expect(cn("foo", showBar && "bar", showBaz && "baz")).toBe("foo bar");
  });

  it("resolves Tailwind conflicts (last wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("py-1", "py-3")).toBe("py-3");
  });

  it("handles null and undefined", () => {
    expect(cn("foo", null, "bar", undefined)).toBe("foo bar");
  });

  it("handles empty strings", () => {
    expect(cn("foo", "", "bar")).toBe("foo bar");
  });

  it("handles arrays", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });

  it("handles objects", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  it("handles mixed inputs", () => {
    expect(cn("foo", ["bar", "baz"], { qux: true }, null, "final")).toBe("foo bar baz qux final");
  });

  it("resolves complex Tailwind conflicts", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("preserves non-conflicting classes", () => {
    expect(cn("px-2", "py-4", "text-center")).toBe("px-2 py-4 text-center");
  });
});
