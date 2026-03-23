'use client';

import { apiFetch, CHAT_BLOCK_USERS_ROUTES } from '@profile/api-client';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

// --- Types ---

export interface BlockedUser {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  blockedAt: string;
  reason: string | null;
}

interface BlockedUsersResponse {
  blockedUsers: BlockedUser[];
}

interface BlockUserResponse {
  blockedUser: BlockedUser;
}

// --- Query keys ---

const blockKeys = {
  all: ['chat', 'blocked'] as const,
  list: () => [...blockKeys.all, 'list'] as const,
  status: (userId: string) => [...blockKeys.all, 'status', userId] as const,
};

// --- Hooks ---

export function useBlockedUsers() {
  return useQuery({
    queryKey: blockKeys.list(),
    queryFn: async () => {
      const result = await apiFetch.get<BlockedUsersResponse>(
        CHAT_BLOCK_USERS_ROUTES.CHAT_BLOCK_USERS_GET_BLOCKED_USERS,
      );
      return result.blockedUsers;
    },
    staleTime: 30_000,
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { userId: string; reason?: string }) => {
      const result = await apiFetch.post<BlockUserResponse>(
        CHAT_BLOCK_USERS_ROUTES.CHAT_BLOCK_USERS_BLOCK_USER,
        { userId: params.userId, reason: params.reason },
      );
      return result.blockedUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockKeys.list() });
    },
  });
}

export function useUnblockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await apiFetch.delete(`/api/chat/blocked/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockKeys.list() });
    },
  });
}
