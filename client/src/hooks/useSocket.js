// client/src/hooks/useSocket.js
import { useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from './useAuth';

export const useSocket = () => {
  const { token, user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token || !user) return;

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected');
      socketRef.current.emit('join_notification_room', { userId: user.id });
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token, user]);

  const emit = useCallback((eventName, data) => {
    if (socketRef.current) {
      socketRef.current.emit(eventName, data);
    }
  }, []);

  const on = useCallback((eventName, callback) => {
    if (socketRef.current) {
      socketRef.current.on(eventName, callback);
    }
  }, []);

  const off = useCallback((eventName, callback) => {
    if (socketRef.current) {
      socketRef.current.off(eventName, callback);
    }
  }, []);

  return { socket: socketRef.current, emit, on, off };
};
