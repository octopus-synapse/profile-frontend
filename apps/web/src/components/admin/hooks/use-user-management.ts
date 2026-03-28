'use client';

/**
 * User Management Hooks
 *
 * Wired to backend SDK for admin user CRUD operations.
 */

import { apiFetch } from '@profile/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CACHE_TIMES } from '@/shared/constants/cache-times';
import type { PaginatedResponse } from '@/shared/types/api-responses';
import { buildUserFiltersQuery } from '@/shared/utils/query-builder';
import type { UserRole } from '../types';

export interface UsersListUsersParams {
  search?: string;
  role?: UserRole;
  page?: number;
  limit?: number;
}

export interface AdminUserData {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: string;
  lastLogin: string | null;
  isVerified: boolean;
  image?: string | null;
  resumeCount: number;
  lastLoginAt: string | null;
}

interface UsersListResponse {
  users: AdminUserData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const USER_MANAGEMENT_QUERY_KEY = ['admin', 'users'];

export function useUsersListUsers(params: UsersListUsersParams) {
  return useQuery<UsersListResponse>({
    queryKey: [...USER_MANAGEMENT_QUERY_KEY, params],
    queryFn: async () => {
      const query = buildUserFiltersQuery(params);

      const response = await apiFetch.get<PaginatedResponse<AdminUserData>>(
        `/api/v1/users/manage${query}`,
      );

      return {
        users: response.data,
        total: response.meta.total,
        page: response.meta.page,
        limit: response.meta.limit,
        totalPages: response.meta.totalPages,
      };
    },
    staleTime: CACHE_TIMES.SHORT,
  });
}

export function useUsersDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await apiFetch.delete(`/api/v1/users/manage/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_MANAGEMENT_QUERY_KEY });
    },
  });
}

export function useUsersUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: { id: string; data: Partial<AdminUserData> }) => {
      await apiFetch.patch(`/api/v1/users/manage/${args.id}`, args.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_MANAGEMENT_QUERY_KEY });
    },
  });
}
