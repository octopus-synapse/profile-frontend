/**
 * Format utility tests
 * Tests text and number formatting behavior
 */

import { describe, it, expect } from "bun:test";
import {
  formatRelativeTime,
  formatNumber,
  truncate,
  capitalize,
  slugify,
} from "../format";

describe("formatRelativeTime", () => {
  it("formats recent dates", () => {
    const date = new Date(Date.now() - 30 * 1000); // 30 seconds ago
    const result = formatRelativeTime(date);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("handles string dates", () => {
    const dateString = new Date().toISOString();
    const result = formatRelativeTime(dateString);
    expect(result).toBeTruthy();
  });

  it("respects locale", () => {
    const date = new Date(Date.now() - 60 * 1000);
    const result = formatRelativeTime(date, "pt-BR");
    expect(result).toBeTruthy();
  });
});

describe("formatNumber", () => {
  it("formats numbers with thousands separator", () => {
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(1000000)).toBe("1,000,000");
  });

  it("formats small numbers without separator", () => {
    expect(formatNumber(123)).toBe("123");
    expect(formatNumber(42)).toBe("42");
  });

  it("respects locale", () => {
    const result = formatNumber(1000, "pt-BR");
    expect(result).toBeTruthy();
  });

  it("handles decimal numbers", () => {
    expect(formatNumber(1234.56)).toBe("1,234.56");
  });
});

describe("truncate", () => {
  it("returns original text if within limit", () => {
    expect(truncate("short", 10)).toBe("short");
  });

  it("truncates text exceeding limit", () => {
    const longText = "This is a very long text that needs truncation";
    const result = truncate(longText, 20);
    expect(result.length).toBe(20);
    expect(result).toEndWith("...");
  });

  it("handles exact length", () => {
    const text = "exact";
    expect(truncate(text, 5)).toBe("exact");
  });

  it("handles empty string", () => {
    expect(truncate("", 10)).toBe("");
  });
});

describe("capitalize", () => {
  it("capitalizes first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("world")).toBe("World");
  });

  it("handles already capitalized", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });

  it("handles single character", () => {
    expect(capitalize("a")).toBe("A");
  });

  it("handles empty string", () => {
    expect(capitalize("")).toBe("");
  });
});

describe("slugify", () => {
  it("converts to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("hello world")).toBe("hello-world");
    expect(slugify("hello  world")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("hello@world!")).toBe("helloworld");
    expect(slugify("hello#world$")).toBe("helloworld");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("-hello-world-")).toBe("hello-world");
    expect(slugify("---hello---")).toBe("hello");
  });

  it("handles multiple consecutive separators", () => {
    expect(slugify("hello___world")).toBe("hello-world");
    expect(slugify("hello---world")).toBe("hello-world");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });
});

