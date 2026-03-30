/**
 * useSocketEvents - Subscribe to WebSocket events for chat.
 * WebSocket hook - legitimate local state for real-time data.
 */

import { useEffect } from 'react';
import { useSocket } from '@/shared/providers/socket-provider';

interface UserStatusEvent {
  userId: string;
  isOnline: boolean;
}

type UserStatusHandler = (event: UserStatusEvent) => void;

export function useSocketEvents(onUserStatus: UserStatusHandler) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleUserOnline = (data: { userId: string }) => {
      onUserStatus({ userId: data.userId, isOnline: true });
    };

    const handleUserOffline = (data: { userId: string }) => {
      onUserStatus({ userId: data.userId, isOnline: false });
    };

    socket.on('user:online', handleUserOnline);
    socket.on('user:offline', handleUserOffline);

    return () => {
      socket.off('user:online', handleUserOnline);
      socket.off('user:offline', handleUserOffline);
    };
  }, [socket, onUserStatus]);
}
