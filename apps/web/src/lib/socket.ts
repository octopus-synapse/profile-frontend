import { io, type Socket } from 'socket.io-client';
import { API_URL } from '@/config/env';

const SOCKET_CONFIG = {
  namespace: '/chat',
  reconnectionAttempts: 10,
  reconnectionDelay: 1_000,
  reconnectionDelayMax: 30_000,
  timeout: 10_000,
} as const;

let socketInstance: Socket | null = null;

export function createSocket(): Socket {
  if (socketInstance?.connected) return socketInstance;

  socketInstance = io(`${API_URL}${SOCKET_CONFIG.namespace}`, {
    withCredentials: true,
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: SOCKET_CONFIG.reconnectionAttempts,
    reconnectionDelay: SOCKET_CONFIG.reconnectionDelay,
    reconnectionDelayMax: SOCKET_CONFIG.reconnectionDelayMax,
    timeout: SOCKET_CONFIG.timeout,
    transports: ['websocket', 'polling'],
  });

  return socketInstance;
}

export function getSocket(): Socket | null {
  return socketInstance;
}

export function disconnectSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
