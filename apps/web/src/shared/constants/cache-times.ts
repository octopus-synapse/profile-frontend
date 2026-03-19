/**
 * Centralized staleTime values for TanStack Query.
 * Prevents inconsistent cache durations across hooks.
 */
export const CACHE_TIMES = {
  /** 15 seconds — real-time data (chat, notifications) */
  REALTIME: 15_000,
  /** 30 seconds — frequently updated data (user lists, activity) */
  SHORT: 30_000,
  /** 5 minutes — stable data (resume content, profile) */
  MEDIUM: 5 * 60 * 1000,
  /** 10 minutes — semi-static data (section types, config) */
  LONG: 10 * 60 * 1000,
  /** 24 hours — static reference data (tech skills catalog, enums) */
  STATIC: 24 * 60 * 60 * 1000,
} as const;
