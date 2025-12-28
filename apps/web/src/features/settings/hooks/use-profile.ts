/**
 * Profile Hooks
 * React Query hooks for user profile management
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileRepository } from "../services/settings-repository";
import type { UpdateProfilePayload } from "../types";

export const profileKeys = {
  all: ["profile"] as const,
  detail: () => [...profileKeys.all, "detail"] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: () => profileRepository.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => profileRepository.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}
