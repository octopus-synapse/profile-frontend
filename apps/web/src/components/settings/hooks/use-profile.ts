/**
 * Profile Hooks
 * React Query hooks for user profile management
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileRepository } from '../services/settings-repository';
import type { UpdateProfilePayload } from '../types';

export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
  usernameCheck: (username: string) => [...profileKeys.all, 'username-check', username] as const,
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
      void queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

export function useCheckUsernameAvailability(username: string) {
  return useQuery({
    queryKey: profileKeys.usernameCheck(username),
    queryFn: () => profileRepository.checkUsernameAvailability(username),
    enabled: !!username && username.length >= 3,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useUpdateUsername() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => profileRepository.updateUsername(username),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}
