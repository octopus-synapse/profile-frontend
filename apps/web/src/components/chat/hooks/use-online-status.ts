'use client';

import { useCallback, useState } from 'react';
import type { OnlineStatusMap } from './use-socket-events';

/**
 * Maintains a map of user online statuses from socket events.
 * Feed the `handleUserStatus` callback into `useSocketEvents`.
 */
export function useOnlineStatus() {
  const [statusMap, setStatusMap] = useState<OnlineStatusMap>(new Map());

  const handleUserStatus = useCallback(
    (event: { userId: string; isOnline: boolean; lastSeen?: string }) => {
      setStatusMap((prev) => {
        const next = new Map(prev);
        next.set(event.userId, {
          isOnline: event.isOnline,
          lastSeen: event.lastSeen,
        });
        return next;
      });
    },
    [],
  );

  const isOnline = useCallback(
    (userId: string) => statusMap.get(userId)?.isOnline ?? false,
    [statusMap],
  );

  const getLastSeen = useCallback(
    (userId: string) => statusMap.get(userId)?.lastSeen ?? null,
    [statusMap],
  );

  return { statusMap, handleUserStatus, isOnline, getLastSeen };
}
