/**
 * Public Profile Hook
 * React Query hook for fetching public profile data
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicProfile } from "../services/profile.service";

export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: ["publicProfile", username],
    queryFn: () => getPublicProfile(username),
    enabled: !!username,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
