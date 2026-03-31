'use client';

/**
 * WebSocket typing indicator hook
 * Manages typing state for chat conversations
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSocket } from '@/shared/providers/socket-provider';

export function useTyping(conversationId: string) {
  const { socket, isConnected } = useSocket();
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Listen for typing events
  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return;

    const handleTyping = (data: { conversationId: string; userId: string; isTyping: boolean }) => {
      if (data.conversationId === conversationId) {
        setIsOtherTyping(data.isTyping);

        // Auto-clear typing indicator after 3 seconds
        if (data.isTyping) {
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setIsOtherTyping(false), 3000);
        }
      }
    };

    socket.on('typing', handleTyping);

    return () => {
      socket.off('typing', handleTyping);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [socket, isConnected, conversationId]);

  // Emit typing start
  const emitTypingStart = useCallback(() => {
    if (!socket || !isConnected || !conversationId) return;
    socket.emit('typing:start', { conversationId });
  }, [socket, isConnected, conversationId]);

  // Emit typing stop
  const emitTypingStop = useCallback(() => {
    if (!socket || !isConnected || !conversationId) return;
    socket.emit('typing:stop', { conversationId });
  }, [socket, isConnected, conversationId]);

  return { isOtherTyping, emitTypingStart, emitTypingStop };
}
