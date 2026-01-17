/**
 * Analytics Store Tests
 *
 * Tests behavior for analytics operations including
 * resume analytics, share analytics, and user summary.
 */

import { describe, it, expect, mock } from "bun:test";
import { createAnalyticsStore } from "../analytics.store";
import type { ProfileApiClient } from "@profile/api-client";

const mockResumeAnalytics = {
 resumeId: "resume-1",
 views: 100,
 downloads: 25,
 shares: 10,
 lastViewedAt: new Date("2025-01-10"),
 createdAt: new Date("2025-01-01"),
 updatedAt: new Date("2025-01-10"),
};

const mockShareAnalytics = {
 shareId: "share-1",
 totalViews: 50,
 uniqueVisitors: 30,
 downloads: 5,
 topReferrers: [{ referer: "linkedin.com", count: 20 }],
 viewsByDate: [{ date: "2025-01-10", count: 15 }],
 lastViewedAt: new Date("2025-01-10"),
};

const mockUserSummary = {
 totalViews: 500,
 totalDownloads: 100,
 totalShares: 50,
 mostViewedResume: { id: "resume-1", title: "Main Resume", views: 200 },
};

const createMockApiClient = (
 overrides: Partial<ProfileApiClient["analytics"]> = {}
) => {
 return {
  analytics: {
   getResumeAnalytics: mock(() => Promise.resolve(mockResumeAnalytics)),
   getShareAnalytics: mock(() => Promise.resolve(mockShareAnalytics)),
   getUserAnalyticsSummary: mock(() => Promise.resolve(mockUserSummary)),
   ...overrides,
  },
 } as unknown as ProfileApiClient;
};

describe("AnalyticsStore", () => {
 describe("Initial State", () => {
  it("should have empty resumeAnalytics map", () => {
   const apiClient = createMockApiClient();
   const useStore = createAnalyticsStore(apiClient);

   expect(useStore.getState().resumeAnalytics.size).toBe(0);
  });

  it("should have empty shareAnalytics map", () => {
   const apiClient = createMockApiClient();
   const useStore = createAnalyticsStore(apiClient);

   expect(useStore.getState().shareAnalytics.size).toBe(0);
  });

  it("should have null userSummary", () => {
   const apiClient = createMockApiClient();
   const useStore = createAnalyticsStore(apiClient);

   expect(useStore.getState().userSummary).toBeNull();
  });

  it("should not be loading initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createAnalyticsStore(apiClient);

   expect(useStore.getState().isLoading).toBe(false);
  });

  it("should have no error initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createAnalyticsStore(apiClient);

   expect(useStore.getState().error).toBeNull();
  });
 });

 describe("setLoading / setError / clearError", () => {
  it("should update loading state", () => {
   const apiClient = createMockApiClient();
   const useStore = createAnalyticsStore(apiClient);

   useStore.getState().setLoading(true);

   expect(useStore.getState().isLoading).toBe(true);
  });

  it("should set and clear error", () => {
   const apiClient = createMockApiClient();
   const useStore = createAnalyticsStore(apiClient);

   useStore.getState().setError("Error occurred");
   expect(useStore.getState().error).toBe("Error occurred");

   useStore.getState().clearError();
   expect(useStore.getState().error).toBeNull();
  });
 });

 describe("fetchResumeAnalytics", () => {
  it("should fetch and cache resume analytics by ID", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAnalyticsStore(apiClient);

   const result = await useStore.getState().fetchResumeAnalytics("resume-1");

   expect(result.resumeId).toBe("resume-1");
   expect(result.views).toBe(100);
   expect(useStore.getState().resumeAnalytics.get("resume-1")).toEqual(result);
   expect(useStore.getState().isLoading).toBe(false);
  });

  it("should handle fetch error", async () => {
   const apiClient = createMockApiClient({
    getResumeAnalytics: mock(() =>
     Promise.reject(new Error("Analytics unavailable"))
    ),
   });
   const useStore = createAnalyticsStore(apiClient);

   await expect(
    useStore.getState().fetchResumeAnalytics("resume-1")
   ).rejects.toThrow("Analytics unavailable");
   expect(useStore.getState().error).toBe("Analytics unavailable");
  });

  it("should cache multiple resume analytics", async () => {
   const apiClient = createMockApiClient({
    getResumeAnalytics: mock((id: string) =>
     Promise.resolve({ ...mockResumeAnalytics, resumeId: id })
    ),
   });
   const useStore = createAnalyticsStore(apiClient);

   await useStore.getState().fetchResumeAnalytics("resume-1");
   await useStore.getState().fetchResumeAnalytics("resume-2");

   expect(useStore.getState().resumeAnalytics.size).toBe(2);
   expect(useStore.getState().resumeAnalytics.has("resume-1")).toBe(true);
   expect(useStore.getState().resumeAnalytics.has("resume-2")).toBe(true);
  });
 });

 describe("fetchShareAnalytics", () => {
  it("should fetch and cache share analytics", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAnalyticsStore(apiClient);

   const result = await useStore.getState().fetchShareAnalytics("share-1");

   expect(result.shareId).toBe("share-1");
   expect(result.totalViews).toBe(50);
   expect(useStore.getState().shareAnalytics.get("share-1")).toEqual(result);
  });

  it("should pass time range to API", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAnalyticsStore(apiClient);
   const timeRange = {
    startDate: "2025-01-01",
    endDate: "2025-01-31",
   };

   await useStore.getState().fetchShareAnalytics("share-1", timeRange);

   expect(apiClient.analytics.getShareAnalytics).toHaveBeenCalledWith(
    "share-1",
    timeRange
   );
  });

  it("should handle fetch error", async () => {
   const apiClient = createMockApiClient({
    getShareAnalytics: mock(() => Promise.reject(new Error("Share not found"))),
   });
   const useStore = createAnalyticsStore(apiClient);

   await expect(
    useStore.getState().fetchShareAnalytics("invalid-share")
   ).rejects.toThrow("Share not found");
   expect(useStore.getState().error).toBe("Share not found");
  });
 });

 describe("fetchUserSummary", () => {
  it("should fetch and store user analytics summary", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAnalyticsStore(apiClient);

   const result = await useStore.getState().fetchUserSummary();

   expect(result.totalViews).toBe(500);
   expect(result.totalDownloads).toBe(100);
   expect(result.mostViewedResume?.title).toBe("Main Resume");
   expect(useStore.getState().userSummary).toEqual(result);
  });

  it("should handle fetch error", async () => {
   const apiClient = createMockApiClient({
    getUserAnalyticsSummary: mock(() =>
     Promise.reject(new Error("Summary unavailable"))
    ),
   });
   const useStore = createAnalyticsStore(apiClient);

   await expect(useStore.getState().fetchUserSummary()).rejects.toThrow(
    "Summary unavailable"
   );
   expect(useStore.getState().error).toBe("Summary unavailable");
  });
 });

 describe("getResumeAnalytics", () => {
  it("should return cached analytics for resume ID", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAnalyticsStore(apiClient);

   await useStore.getState().fetchResumeAnalytics("resume-1");
   const cached = useStore.getState().getResumeAnalytics("resume-1");

   expect(cached?.resumeId).toBe("resume-1");
  });

  it("should return undefined for uncached resume ID", () => {
   const apiClient = createMockApiClient();
   const useStore = createAnalyticsStore(apiClient);

   const cached = useStore.getState().getResumeAnalytics("unknown");

   expect(cached).toBeUndefined();
  });
 });

 describe("getShareAnalytics", () => {
  it("should return cached analytics for share ID", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAnalyticsStore(apiClient);

   await useStore.getState().fetchShareAnalytics("share-1");
   const cached = useStore.getState().getShareAnalytics("share-1");

   expect(cached?.shareId).toBe("share-1");
  });

  it("should return undefined for uncached share ID", () => {
   const apiClient = createMockApiClient();
   const useStore = createAnalyticsStore(apiClient);

   const cached = useStore.getState().getShareAnalytics("unknown");

   expect(cached).toBeUndefined();
  });
 });
});
