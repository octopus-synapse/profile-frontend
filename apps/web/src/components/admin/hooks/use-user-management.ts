'use client';

/**
 * User Management Hooks (Stub Implementation)
 *
 * These hooks provide stub implementations for admin user management.
 * They will return empty data until the backend endpoints are implemented.
 *
 * TODO: Replace with actual SDK hooks when backend implements:
 * - GET /admin/users (list users with pagination/filtering)
 * - DELETE /admin/users/:id (delete user)
 * - PATCH /admin/users/:id (update user)
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Parameters for listing users
 */
export interface UsersListUsersParams {
  search?: string;
  role?: 'ADMIN' | 'USER';
  page?: number;
  limit?: number;
}

/**
 * User data returned from the API
 */
export interface AdminUserData {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  lastLogin: string | null;
  isVerified: boolean;
  image?: string | null;
  resumeCount: number;
  lastLoginAt: string | null;
}

/**
 * Paginated users response
 */
interface UsersListResponse {
  users: AdminUserData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const USER_MANAGEMENT_QUERY_KEY = ['admin', 'users'];

/**
 * List users with filtering and pagination
 * @stub Returns empty data - waiting for backend implementation
 */
export function useUsersListUsers(params: UsersListUsersParams) {
  return useQuery<UsersListResponse>({
    queryKey: [...USER_MANAGEMENT_QUERY_KEY, params],
    queryFn: async () => {
      // TODO: Replace with actual API call when backend is ready
      // return await usersListUsers(params);

      // Stub: Return empty paginated response
      return {
        users: [],
        total: 0,
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        totalPages: 0,
      };
    },
    staleTime: 30 * 1000,
  });
}

/**
 * Delete a user by ID
 * @stub Mutation succeeds but does nothing - waiting for backend
 */
export function useUsersDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_userId: string) => {
      // TODO: Replace with actual API call when backend is ready
      // return await usersDeleteUser(userId);

      // Stub: Simulate successful deletion
      console.warn('[STUB] useUsersDeleteUser: Backend not implemented yet');
      return { data: { success: true } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_MANAGEMENT_QUERY_KEY });
    },
  });
}

/**
 * Update a user's data
 * @stub Mutation succeeds but does nothing - waiting for backend
 */
export function useUsersUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_args: { id: string; data: Partial<AdminUserData> }) => {
      // TODO: Replace with actual API call when backend is ready
      // return await usersUpdateUser(args.id, args.data);

      // Stub: Simulate successful update
      console.warn('[STUB] useUsersUpdateUser: Backend not implemented yet');
      return { data: { success: true } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_MANAGEMENT_QUERY_KEY });
    },
  });
}
