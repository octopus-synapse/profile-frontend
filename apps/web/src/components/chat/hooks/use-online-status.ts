/**
 * useOnlineStatus - Track user online status via WebSocket.
 * WebSocket hook - legitimate local state for real-time data.
 */

import { useCallback, useState } from 'react';

interface UserStatusEvent {
  userId: string;
  isOnline: boolean;
}

export function useOnlineStatus() {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const handleUserStatus = useCallback((event: UserStatusEvent) => {
    setOnlineUsers((prev) => {
      const next = new Set(prev);
      if (event.isOnline) {
        next.add(event.userId);
      } else {
        next.delete(event.userId);
      }
      return next;
    });
  }, []);

  const isOnline = useCallback(
    (userId: string): boolean => {
      return onlineUsers.has(userId);
    },
    [onlineUsers],
  );

  return {
    onlineUsers,
    handleUserStatus,
    isOnline,
  };
}
