/**
 * Date utility tests
 * Tests date formatting behavior
 */

import { describe, it, expect } from "bun:test";
import { formatDistanceToNow, formatDate, formatDateTime, formatDateRange } from "../date";

describe("formatDistanceToNow", () => {
  it("returns 'just now' for recent dates", () => {
    const now = new Date();
    expect(formatDistanceToNow(now)).toBe("just now");
  });

  it("formats minutes correctly", () => {
    const date = new Date(Date.now() - 30 * 1000 * 60); // 30 minutes ago
    const result = formatDistanceToNow(date);
    expect(result).toBe("30 minutes ago");
  });

  it("formats singular minute correctly", () => {
    const date = new Date(Date.now() - 1 * 1000 * 60); // 1 minute ago
    const result = formatDistanceToNow(date);
    expect(result).toBe("1 minute ago");
  });

  it("formats hours correctly", () => {
    const date = new Date(Date.now() - 2 * 1000 * 60 * 60); // 2 hours ago
    const result = formatDistanceToNow(date);
    expect(result).toBe("2 hours ago");
  });

  it("formats days correctly", () => {
    const date = new Date(Date.now() - 3 * 1000 * 60 * 60 * 24); // 3 days ago
    const result = formatDistanceToNow(date);
    expect(result).toBe("3 days ago");
  });

  it("formats weeks correctly", () => {
    const date = new Date(Date.now() - 2 * 7 * 1000 * 60 * 60 * 24); // 2 weeks ago
    const result = formatDistanceToNow(date);
    expect(result).toContain("week");
  });

  it("formats months correctly", () => {
    const date = new Date(Date.now() - 2 * 30 * 1000 * 60 * 60 * 24); // ~2 months ago
    const result = formatDistanceToNow(date);
    expect(result).toContain("month");
  });

  it("formats years correctly", () => {
    const date = new Date(Date.now() - 2 * 365 * 1000 * 60 * 60 * 24); // ~2 years ago
    const result = formatDistanceToNow(date);
    expect(result).toContain("year");
  });
});

describe("formatDate", () => {
  it("formats date in default format", () => {
    const date = new Date("2024-01-15");
    const result = formatDate(date);
    expect(result).toContain("Jan");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });

  it("respects custom options", () => {
    const date = new Date("2024-01-15");
    const result = formatDate(date, { year: "numeric", month: "long" });
    expect(result).toContain("January");
    expect(result).toContain("2024");
  });
});

describe("formatDateTime", () => {
  it("formats date with time", () => {
    const date = new Date("2024-01-15T14:30:00");
    const result = formatDateTime(date);
    expect(result).toContain("Jan");
    expect(result).toContain("15");
    expect(result).toContain("2024");
    expect(result).toContain("2:30");
  });
});

describe("formatDateRange", () => {
  it("formats range with end date", () => {
    const start = new Date("2022-01-01");
    const end = new Date("2024-01-01");
    const result = formatDateRange(start, end);
    expect(result).toContain("Jan 2022");
    expect(result).toContain("Jan 2024");
    expect(result).toContain(" - ");
  });

  it("formats range with 'Present' when isCurrent is true", () => {
    const start = new Date("2022-01-01");
    const result = formatDateRange(start, null, true);
    expect(result).toContain("Jan 2022");
    expect(result).toContain("Present");
  });

  it("formats range with 'Present' when endDate is null", () => {
    const start = new Date("2022-01-01");
    const result = formatDateRange(start, null);
    expect(result).toContain("Present");
  });
});

