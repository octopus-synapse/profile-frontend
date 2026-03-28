'use client';

import { apiFetch, CHAT_ROUTES } from '@profile/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useSocket } from '@/shared/providers/socket-provider';

// --- Types ---

interface Participant {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
}

interface LastMessage {
  content: string;
  senderId: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: Participant[];
  lastMessage: LastMessage | null;
  unreadCount: number;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt: string | null;
}

interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
}

interface MessagesResponse {
  messages: Message[];
  nextCursor: string | null;
}

interface UnreadCountResponse {
  totalUnread: number;
  byConversation: Record<string, number>;
}

interface MessageResponse {
  message: Message;
}

interface ConversationWithResponse {
  conversationId: string | null;
  conversation: Conversation | null;
}

// --- Query keys ---

export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...chatKeys.all, 'conversation', id] as const,
  messages: (conversationId: string) => [...chatKeys.all, 'messages', conversationId] as const,
  unread: () => [...chatKeys.all, 'unread'] as const,
};

// --- Hooks ---

export function useConversations() {
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: async () => {
      const result = await apiFetch.get<ConversationsResponse>(CHAT_ROUTES.CHAT_GET_CONVERSATIONS);
      return result.conversations;
    },
    staleTime: 30_000,
  });
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: chatKeys.messages(conversationId),
    queryFn: async () => {
      const result = await apiFetch.get<MessagesResponse>(
        `/api/chat/conversations/${conversationId}/messages`,
      );
      return result.messages;
    },
    enabled: !!conversationId,
    staleTime: 60_000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  return useMutation({
    mutationFn: async (params: { conversationId: string; content: string }) => {
      if (socket && isConnected) {
        return new Promise<Message>((resolve, reject) => {
          socket.emit(
            'message:send',
            { conversationId: params.conversationId, content: params.content },
            (response: { success: boolean; message?: Message; error?: string }) => {
              if (response.success && response.message) {
                resolve(response.message);
              } else {
                reject(new Error(response.error ?? 'Send failed'));
              }
            },
          );
        });
      }

      const result = await apiFetch.post<MessageResponse>(
        `/api/chat/conversations/${params.conversationId}/messages`,
        { content: params.content },
      );
      return result.message;
    },
    onSuccess: (_data, variables) => {
      if (!socket || !isConnected) {
        queryClient.invalidateQueries({
          queryKey: chatKeys.messages(variables.conversationId),
        });
        queryClient.invalidateQueries({
          queryKey: chatKeys.conversations(),
        });
        queryClient.invalidateQueries({ queryKey: chatKeys.unread() });
      }
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { recipientId: string; content: string }) => {
      const result = await apiFetch.post<MessageResponse>(CHAT_ROUTES.CHAT_SEND_MESSAGE, {
        recipientId: params.recipientId,
        content: params.content,
      });
      return result.message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversations(),
      });
    },
  });
}

export function useUnreadCount() {
  const { isConnected } = useSocket();

  return useQuery({
    queryKey: chatKeys.unread(),
    queryFn: async () => {
      return apiFetch.get<UnreadCountResponse>(CHAT_ROUTES.CHAT_GET_UNREAD_COUNT);
    },
    staleTime: 30_000,
    refetchInterval: isConnected ? false : 30_000,
  });
}

export function useConversationWith(userId: string) {
  return useQuery({
    queryKey: [...chatKeys.all, 'conversation-with', userId],
    queryFn: async () => {
      return apiFetch.get<ConversationWithResponse>(`/api/chat/conversation-with/${userId}`);
    },
    enabled: !!userId,
  });
}

/**
 * Emits `message:read` via socket and invalidates unread cache.
 */
export function useMarkAsRead() {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  return useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit('message:read', { conversationId });
      }
      queryClient.invalidateQueries({ queryKey: chatKeys.unread() });
    },
    [socket, isConnected, queryClient],
  );
}
