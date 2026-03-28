'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSocket } from '@/shared/providers/socket-provider';
import type { Message } from './use-chat';
import { chatKeys } from './use-chat';

interface MessageNewEvent {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface MessagesReadEvent {
  conversationId: string;
  readBy: string;
  readAt: string;
}

interface UserStatusEvent {
  userId: string;
  isOnline: boolean;
  lastSeen?: string;
}

export type OnlineStatusMap = Map<string, { isOnline: boolean; lastSeen?: string }>;

/**
 * Subscribes to Socket.IO events and updates TanStack Query cache.
 * Call once per mounted chat view — handles all real-time event routing.
 */
export function useSocketEvents(onUserStatus?: (event: UserStatusEvent) => void) {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (event: MessageNewEvent) => {
      const newMessage: Message = {
        id: event.id,
        conversationId: event.conversationId,
        senderId: event.senderId,
        content: event.content,
        createdAt: event.createdAt,
        readAt: null,
      };

      queryClient.setQueryData<Message[]>(chatKeys.messages(event.conversationId), (old) =>
        old ? [...old, newMessage] : [newMessage],
      );

      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
      queryClient.invalidateQueries({ queryKey: chatKeys.unread() });
    };

    const handleMessagesRead = (event: MessagesReadEvent) => {
      queryClient.setQueryData<Message[]>(chatKeys.messages(event.conversationId), (old) =>
        old?.map((msg) =>
          msg.senderId !== event.readBy && !msg.readAt ? { ...msg, readAt: event.readAt } : msg,
        ),
      );
    };

    const handleUserStatus = (event: UserStatusEvent) => {
      onUserStatus?.(event);
    };

    socket.on('message:new', handleNewMessage);
    socket.on('messages:read', handleMessagesRead);
    socket.on('user:status', handleUserStatus);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('messages:read', handleMessagesRead);
      socket.off('user:status', handleUserStatus);
    };
  }, [socket, isConnected, queryClient, onUserStatus]);
}
