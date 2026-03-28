'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSocket } from '@/shared/providers/socket-provider';

interface TypingEvent {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

const TYPING_DEBOUNCE_MS = 300;
const TYPING_TIMEOUT_MS = 2_000;

/**
 * Manages typing indicator emission and reception for a conversation.
 */
export function useTyping(conversationId: string | null) {
  const { socket, isConnected } = useSocket();
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const emitTypingStart = useCallback(() => {
    if (!socket || !isConnected || !conversationId) return;

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

    typingTimerRef.current = setTimeout(() => {
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        socket.emit('typing:start', { conversationId });
      }

      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      stopTimerRef.current = setTimeout(() => {
        isTypingRef.current = false;
        socket.emit('typing:stop', { conversationId });
      }, TYPING_TIMEOUT_MS);
    }, TYPING_DEBOUNCE_MS);
  }, [socket, isConnected, conversationId]);

  const emitTypingStop = useCallback(() => {
    if (!socket || !isConnected || !conversationId) return;

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);

    if (isTypingRef.current) {
      isTypingRef.current = false;
      socket.emit('typing:stop', { conversationId });
    }
  }, [socket, isConnected, conversationId]);

  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return;

    const handleTyping = (event: TypingEvent) => {
      if (event.conversationId !== conversationId) return;

      setTypingUsers((prev) => {
        const next = new Set(prev);
        if (event.isTyping) {
          next.add(event.userId);
        } else {
          next.delete(event.userId);
        }
        return next;
      });
    };

    socket.on('typing', handleTyping);

    return () => {
      socket.off('typing', handleTyping);
      emitTypingStop();
    };
  }, [socket, isConnected, conversationId, emitTypingStop]);

  return {
    typingUsers,
    isOtherTyping: typingUsers.size > 0,
    emitTypingStart,
    emitTypingStop,
  };
}
