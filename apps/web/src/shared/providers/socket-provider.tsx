'use client';

import { selectEnvelopeData, useAuthSession } from '@profile/api-client';
import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { createSocket, disconnectSocket } from '@/lib/socket';

type ConnectionStatus = 'disconnected' | 'connected' | 'reconnecting';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  status: ConnectionStatus;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  status: 'disconnected',
});

export function useSocket(): SocketContextValue {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const { data: session } = useAuthSession({ query: { select: selectEnvelopeData } });
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const socketRef = useRef<Socket | null>(null);

  const isAuthenticated = Boolean(session?.user?.id);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isAuthenticated) {
      disconnectSocket();
      socketRef.current = null;
      setStatus('disconnected');
      return;
    }

    const socket = createSocket();
    socketRef.current = socket;

    const onConnect = () => setStatus('connected');
    const onDisconnect = () => setStatus('disconnected');
    const onReconnectAttempt = () => setStatus('reconnecting');
    const onReconnectFailed = () => setStatus('disconnected');

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.io.on('reconnect_attempt', onReconnectAttempt);
    socket.io.on('reconnect_failed', onReconnectFailed);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.io.off('reconnect_attempt', onReconnectAttempt);
      socket.io.off('reconnect_failed', onReconnectFailed);
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected: status === 'connected',
        status,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
