'use client';

import {
  apiFetch,
  getChatBlockUsersBlockUserUrl,
  getChatBlockUsersGetBlockedUsersUrl,
  getChatBlockUsersUnblockUserUrl,
} from '@profile/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
        getChatBlockUsersGetBlockedUsersUrl(),
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
      const result = await apiFetch.post<BlockUserResponse>(getChatBlockUsersBlockUserUrl(), {
        userId: params.userId,
        reason: params.reason,
      });
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
      await apiFetch.delete(getChatBlockUsersUnblockUserUrl(userId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockKeys.list() });
    },
  });
}
