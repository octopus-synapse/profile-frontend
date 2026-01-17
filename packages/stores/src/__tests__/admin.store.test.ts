/**
 * Admin Store Tests
 *
 * Tests admin dashboard operations including stats,
 * activity, health, and user management.
 */

import { describe, it, expect, mock } from "bun:test";
import { createAdminStore } from "../admin.store";
import type { ProfileApiClient } from "@profile/api-client";

const mockStats = {
 totalUsers: 1000,
 totalResumes: 5000,
 totalThemes: 50,
 activeUsersToday: 150,
 newUsersThisWeek: 75,
 resumesCreatedThisWeek: 200,
};

const mockActivity = [
 {
  id: "act-1",
  userId: "user-1",
  username: "john",
  action: "created",
  resource: "resume",
  resourceId: "resume-1",
  timestamp: "2025-01-14T10:00:00Z",
 },
];

const mockHealth = {
 status: "healthy" as const,
 database: { status: "connected", latency: 5 },
 redis: { status: "connected", latency: 2 },
 storage: { status: "ok", usedSpace: 75 },
 uptime: 864000,
};

const mockRecentUsers = [
 {
  id: "user-1",
  email: "john@example.com",
  username: "john",
  createdAt: "2025-01-14T00:00:00Z",
  resumeCount: 3,
  lastActiveAt: "2025-01-14T10:00:00Z",
 },
];

const createMockApiClient = (
 overrides: Partial<ProfileApiClient["admin"]> = {}
) => {
 return {
  admin: {
   getStats: mock(() => Promise.resolve(mockStats)),
   getRecentActivity: mock(() => Promise.resolve(mockActivity)),
   getSystemHealth: mock(() => Promise.resolve(mockHealth)),
   getRecentUsers: mock(() => Promise.resolve(mockRecentUsers)),
   ...overrides,
  },
 } as unknown as ProfileApiClient;
};

describe("AdminStore", () => {
 describe("Initial State", () => {
  it("should have null stats when created", () => {
   const apiClient = createMockApiClient();
   const useStore = createAdminStore(apiClient);

   expect(useStore.getState().stats).toBeNull();
  });

  it("should have empty recentActivity array", () => {
   const apiClient = createMockApiClient();
   const useStore = createAdminStore(apiClient);

   expect(useStore.getState().recentActivity).toEqual([]);
  });

  it("should have null systemHealth", () => {
   const apiClient = createMockApiClient();
   const useStore = createAdminStore(apiClient);

   expect(useStore.getState().systemHealth).toBeNull();
  });

  it("should have empty recentUsers array", () => {
   const apiClient = createMockApiClient();
   const useStore = createAdminStore(apiClient);

   expect(useStore.getState().recentUsers).toEqual([]);
  });

  it("should not be loading initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createAdminStore(apiClient);

   expect(useStore.getState().isLoading).toBe(false);
  });
 });

 describe("setLoading / setError / clearError", () => {
  it("should update loading state", () => {
   const apiClient = createMockApiClient();
   const useStore = createAdminStore(apiClient);

   useStore.getState().setLoading(true);

   expect(useStore.getState().isLoading).toBe(true);
  });

  it("should set and clear error", () => {
   const apiClient = createMockApiClient();
   const useStore = createAdminStore(apiClient);

   useStore.getState().setError("Admin error");
   expect(useStore.getState().error).toBe("Admin error");

   useStore.getState().clearError();
   expect(useStore.getState().error).toBeNull();
  });
 });

 describe("fetchStats", () => {
  it("should fetch and store admin stats", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAdminStore(apiClient);

   const result = await useStore.getState().fetchStats();

   expect(result.totalUsers).toBe(1000);
   expect(result.totalResumes).toBe(5000);
   expect(result.activeUsersToday).toBe(150);
   expect(useStore.getState().stats).toEqual(result);
   expect(useStore.getState().isLoading).toBe(false);
  });

  it("should handle fetch error", async () => {
   const apiClient = createMockApiClient({
    getStats: mock(() => Promise.reject(new Error("Forbidden"))),
   });
   const useStore = createAdminStore(apiClient);

   await expect(useStore.getState().fetchStats()).rejects.toThrow("Forbidden");
   expect(useStore.getState().error).toBe("Forbidden");
  });
 });

 describe("fetchRecentActivity", () => {
  it("should fetch recent activity with default limit", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAdminStore(apiClient);

   const result = await useStore.getState().fetchRecentActivity();

   expect(result).toHaveLength(1);
   expect(result[0].action).toBe("created");
   expect(apiClient.admin.getRecentActivity).toHaveBeenCalledWith(10);
  });

  it("should fetch recent activity with custom limit", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAdminStore(apiClient);

   await useStore.getState().fetchRecentActivity(25);

   expect(apiClient.admin.getRecentActivity).toHaveBeenCalledWith(25);
  });

  it("should handle fetch error", async () => {
   const apiClient = createMockApiClient({
    getRecentActivity: mock(() =>
     Promise.reject(new Error("Service unavailable"))
    ),
   });
   const useStore = createAdminStore(apiClient);

   await expect(useStore.getState().fetchRecentActivity()).rejects.toThrow(
    "Service unavailable"
   );
   expect(useStore.getState().error).toBe("Service unavailable");
  });
 });

 describe("fetchSystemHealth", () => {
  it("should fetch system health status", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAdminStore(apiClient);

   const result = await useStore.getState().fetchSystemHealth();

   expect(result.status).toBe("healthy");
   expect(result.database.status).toBe("connected");
   expect(result.uptime).toBe(864000);
   expect(useStore.getState().systemHealth).toEqual(result);
  });

  it("should handle fetch error", async () => {
   const apiClient = createMockApiClient({
    getSystemHealth: mock(() =>
     Promise.reject(new Error("Health check failed"))
    ),
   });
   const useStore = createAdminStore(apiClient);

   await expect(useStore.getState().fetchSystemHealth()).rejects.toThrow(
    "Health check failed"
   );
   expect(useStore.getState().error).toBe("Health check failed");
  });
 });

 describe("fetchRecentUsers", () => {
  it("should fetch recent users with default limit", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAdminStore(apiClient);

   const result = await useStore.getState().fetchRecentUsers();

   expect(result).toHaveLength(1);
   expect(result[0].username).toBe("john");
   expect(apiClient.admin.getRecentUsers).toHaveBeenCalledWith(5);
  });

  it("should fetch recent users with custom limit", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAdminStore(apiClient);

   await useStore.getState().fetchRecentUsers(20);

   expect(apiClient.admin.getRecentUsers).toHaveBeenCalledWith(20);
  });

  it("should handle fetch error", async () => {
   const apiClient = createMockApiClient({
    getRecentUsers: mock(() => Promise.reject(new Error("Access denied"))),
   });
   const useStore = createAdminStore(apiClient);

   await expect(useStore.getState().fetchRecentUsers()).rejects.toThrow(
    "Access denied"
   );
   expect(useStore.getState().error).toBe("Access denied");
  });
 });

 describe("fetchDashboardData", () => {
  it("should fetch all dashboard data in parallel", async () => {
   const apiClient = createMockApiClient();
   const useStore = createAdminStore(apiClient);

   await useStore.getState().fetchDashboardData();

   expect(useStore.getState().stats).not.toBeNull();
   expect(useStore.getState().recentActivity.length).toBeGreaterThan(0);
   expect(useStore.getState().systemHealth).not.toBeNull();
   expect(useStore.getState().recentUsers.length).toBeGreaterThan(0);
   expect(useStore.getState().isLoading).toBe(false);
  });

  it("should handle partial failure gracefully", async () => {
   const apiClient = createMockApiClient({
    getSystemHealth: mock(() => Promise.reject(new Error("Health failed"))),
   });
   const useStore = createAdminStore(apiClient);

   await expect(useStore.getState().fetchDashboardData()).rejects.toThrow();
   expect(useStore.getState().error).toBeTruthy();
  });
 });
});
