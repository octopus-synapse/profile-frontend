/**
 * Admin Query Keys
 */

export const adminKeys = {
  all: ["admin"] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
  activity: (limit?: number) => [...adminKeys.all, "activity", limit] as const,
  health: () => [...adminKeys.all, "health"] as const,
  recentUsers: (limit?: number) => [...adminKeys.all, "recent-users", limit] as const,
};
