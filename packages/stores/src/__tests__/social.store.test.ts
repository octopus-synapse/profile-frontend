/**
 * Social Store Tests
 *
 * Tests social features: follow/unfollow, activity feed, stats.
 */

import { describe, it, expect, mock } from "bun:test";
import { createSocialStore } from "../social.store";
import type { ProfileApiClient } from "@profile/api-client";

const mockFollower = {
 id: "user-2",
 username: "follower1",
 displayName: "Follower One",
 avatar: "avatar.jpg",
};

const mockActivity = {
 id: "act-1",
 userId: "user-2",
 type: "resume_created",
 data: { resumeId: "resume-1", title: "New Resume" },
 createdAt: "2025-01-14T10:00:00Z",
};

const mockStats = {
 followersCount: 100,
 followingCount: 50,
 postsCount: 25,
};

const createMockApiClient = (
 overrides: Partial<ProfileApiClient["social"]> = {}
) => {
 return {
  social: {
   follow: mock(() => Promise.resolve()),
   unfollow: mock(() => Promise.resolve()),
   getFollowers: mock(() => Promise.resolve({ data: [mockFollower] })),
   getFollowing: mock(() => Promise.resolve({ data: [mockFollower] })),
   getActivityFeed: mock(() => Promise.resolve({ data: [mockActivity] })),
   getSocialStats: mock(() => Promise.resolve(mockStats)),
   ...overrides,
  },
 } as unknown as ProfileApiClient;
};

describe("SocialStore", () => {
 describe("Initial State", () => {
  it("should have empty followers array", () => {
   const apiClient = createMockApiClient();
   const useStore = createSocialStore(apiClient);

   expect(useStore.getState().followers).toEqual([]);
  });

  it("should have empty following array", () => {
   const apiClient = createMockApiClient();
   const useStore = createSocialStore(apiClient);

   expect(useStore.getState().following).toEqual([]);
  });

  it("should have empty activities array", () => {
   const apiClient = createMockApiClient();
   const useStore = createSocialStore(apiClient);

   expect(useStore.getState().activities).toEqual([]);
  });

  it("should have null stats", () => {
   const apiClient = createMockApiClient();
   const useStore = createSocialStore(apiClient);

   expect(useStore.getState().stats).toBeNull();
  });

  it("should not be loading initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createSocialStore(apiClient);

   expect(useStore.getState().isLoading).toBe(false);
  });

  it("should have no error initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createSocialStore(apiClient);

   expect(useStore.getState().error).toBeNull();
  });
 });

 describe("setters", () => {
  it("should set followers", () => {
   const apiClient = createMockApiClient();
   const useStore = createSocialStore(apiClient);
   const followers = [mockFollower as any];

   useStore.getState().setFollowers(followers);

   expect(useStore.getState().followers).toEqual(followers);
  });

  it("should set following", () => {
   const apiClient = createMockApiClient();
   const useStore = createSocialStore(apiClient);
   const following = [mockFollower as any];

   useStore.getState().setFollowing(following);

   expect(useStore.getState().following).toEqual(following);
  });

  it("should set activities", () => {
   const apiClient = createMockApiClient();
   const useStore = createSocialStore(apiClient);
   const activities = [mockActivity as any];

   useStore.getState().setActivities(activities);

   expect(useStore.getState().activities).toEqual(activities);
  });

  it("should set stats", () => {
   const apiClient = createMockApiClient();
   const useStore = createSocialStore(apiClient);

   useStore.getState().setStats(mockStats as any);

   expect(useStore.getState().stats).toEqual(mockStats);
  });

  it("should set and clear error", () => {
   const apiClient = createMockApiClient();
   const useStore = createSocialStore(apiClient);

   useStore.getState().setError("Social error");
   expect(useStore.getState().error).toBe("Social error");

   useStore.getState().clearError();
   expect(useStore.getState().error).toBeNull();
  });
 });

 describe("followUser", () => {
  it("should follow user and update stats", async () => {
   const apiClient = createMockApiClient();
   const useStore = createSocialStore(apiClient);

   // Set initial stats
   useStore.getState().setStats(mockStats as any);

   await useStore.getState().followUser("user-2");

   expect(apiClient.social.follow).toHaveBeenCalledWith("user-2");
   expect(useStore.getState().stats?.followingCount).toBe(51);
   expect(useStore.getState().isLoading).toBe(false);
  });

  it("should handle follow error", async () => {
   const apiClient = createMockApiClient({
    follow: mock(() => Promise.reject(new Error("Cannot follow user"))),
   });
   const useStore = createSocialStore(apiClient);

   await expect(useStore.getState().followUser("user-2")).rejects.toThrow(
    "Cannot follow user"
   );
   expect(useStore.getState().error).toBe("Cannot follow user");
  });
 });

 describe("unfollowUser", () => {
  it("should unfollow user and update stats", async () => {
   const apiClient = createMockApiClient();
   const useStore = createSocialStore(apiClient);

   // Set initial stats
   useStore.getState().setStats(mockStats as any);

   await useStore.getState().unfollowUser("user-2");

   expect(apiClient.social.unfollow).toHaveBeenCalledWith("user-2");
   expect(useStore.getState().stats?.followingCount).toBe(49);
  });

  it("should handle unfollow error", async () => {
   const apiClient = createMockApiClient({
    unfollow: mock(() => Promise.reject(new Error("Cannot unfollow"))),
   });
   const useStore = createSocialStore(apiClient);

   await expect(useStore.getState().unfollowUser("user-2")).rejects.toThrow(
    "Cannot unfollow"
   );
   expect(useStore.getState().error).toBe("Cannot unfollow");
  });
 });

 describe("fetchFollowers", () => {
  it("should fetch and store followers for user", async () => {
   const apiClient = createMockApiClient();
   const useStore = createSocialStore(apiClient);

   await useStore.getState().fetchFollowers("user-1");

   expect(apiClient.social.getFollowers).toHaveBeenCalledWith("user-1");
   expect(useStore.getState().followers).toHaveLength(1);
   expect(useStore.getState().followers[0].username).toBe("follower1");
  });

  it("should handle fetch error", async () => {
   const apiClient = createMockApiClient({
    getFollowers: mock(() =>
     Promise.reject(new Error("Failed to fetch followers"))
    ),
   });
   const useStore = createSocialStore(apiClient);

   await expect(useStore.getState().fetchFollowers("user-1")).rejects.toThrow(
    "Failed to fetch followers"
   );
   expect(useStore.getState().error).toBe("Failed to fetch followers");
  });
 });

 describe("fetchFollowing", () => {
  it("should fetch and store following list", async () => {
   const apiClient = createMockApiClient();
   const useStore = createSocialStore(apiClient);

   await useStore.getState().fetchFollowing("user-1");

   expect(apiClient.social.getFollowing).toHaveBeenCalledWith("user-1");
   expect(useStore.getState().following).toHaveLength(1);
  });

  it("should handle fetch error", async () => {
   const apiClient = createMockApiClient({
    getFollowing: mock(() =>
     Promise.reject(new Error("Failed to fetch following"))
    ),
   });
   const useStore = createSocialStore(apiClient);

   await expect(useStore.getState().fetchFollowing("user-1")).rejects.toThrow(
    "Failed to fetch following"
   );
   expect(useStore.getState().error).toBe("Failed to fetch following");
  });
 });

 describe("fetchActivityFeed", () => {
  it("should fetch and store activity feed", async () => {
   const apiClient = createMockApiClient();
   const useStore = createSocialStore(apiClient);

   await useStore.getState().fetchActivityFeed();

   expect(apiClient.social.getActivityFeed).toHaveBeenCalled();
   expect(useStore.getState().activities).toHaveLength(1);
   expect(useStore.getState().activities[0].type).toBe("resume_created");
  });

  it("should handle fetch error", async () => {
   const apiClient = createMockApiClient({
    getActivityFeed: mock(() =>
     Promise.reject(new Error("Activity feed unavailable"))
    ),
   });
   const useStore = createSocialStore(apiClient);

   await expect(useStore.getState().fetchActivityFeed()).rejects.toThrow(
    "Activity feed unavailable"
   );
   expect(useStore.getState().error).toBe("Activity feed unavailable");
  });
 });

 describe("fetchSocialStats", () => {
  it("should fetch and store social stats", async () => {
   const apiClient = createMockApiClient();
   const useStore = createSocialStore(apiClient);

   await useStore.getState().fetchSocialStats("user-1");

   expect(apiClient.social.getSocialStats).toHaveBeenCalledWith("user-1");
   expect(useStore.getState().stats?.followersCount).toBe(100);
   expect(useStore.getState().stats?.followingCount).toBe(50);
  });

  it("should handle fetch error", async () => {
   const apiClient = createMockApiClient({
    getSocialStats: mock(() => Promise.reject(new Error("Stats unavailable"))),
   });
   const useStore = createSocialStore(apiClient);

   await expect(useStore.getState().fetchSocialStats("user-1")).rejects.toThrow(
    "Stats unavailable"
   );
   expect(useStore.getState().error).toBe("Stats unavailable");
  });
 });
});
