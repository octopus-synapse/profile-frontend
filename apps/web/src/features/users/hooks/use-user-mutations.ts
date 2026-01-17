"use client";

/**
 * User Mutations
 * TanStack Query hooks for user data mutations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userRepository } from "../services/user-repository";
import { userKeys } from "./query-keys";
import type { UpdateUserDto, UserRole } from "../types";

/**
 * Update current user profile
 */
export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserDto) => userRepository.updateMe(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
}

/**
 * Upload profile image
 */
export function useUploadProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userRepository.uploadImage(file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
}

// ============================================================================
// Admin Mutations
// ============================================================================

/**
 * Update user role (Admin)
 */
export function useAdminUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      userRepository.adminUpdateUserRole(userId, role),
    onSuccess: (_, { userId }) => {
      void queryClient.invalidateQueries({ queryKey: userKeys.admin.detail(userId) });
      void queryClient.invalidateQueries({ queryKey: userKeys.admin.list() });
    },
  });
}

/**
 * Delete user (Admin)
 */
export function useAdminDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userRepository.adminDeleteUser(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.admin.list() });
    },
  });
}
