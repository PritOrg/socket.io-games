import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import logger from '../utils/logger';
import { reportRuntimeError } from '../utils/runtimeError';

export const GameContext = createContext();

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('playerProfile');
    return saved
      ? JSON.parse(saved)
      : {
          name: '',
          avatarIcon: 'cat',
          color: '#2a2a3e',
        };
  });
  const [roomId, setRoomId] = useState(null);
  const [gamePrefix, setGamePrefix] = useState(null);
  const [socket, setSocket] = useState(null);
  const [reconnectionState, setReconnectionState] = useState('disconnected');
  const socketRef = useRef(null);
  const lastDisconnectTimeRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutsRef = useRef([]);

  useEffect(() => {
    localStorage.setItem('playerProfile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    const host = window.location.hostname || 'localhost';
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const port = import.meta.env.VITE_PORT || 4000;
    const newSocket = io(`${protocol}//${host}:${port}`);
    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      logger.info('SOCKET', `Connected with ID: ${newSocket.id}`);
      setReconnectionState('connected');
      reconnectAttemptsRef.current = 0;
    });

    newSocket.on('disconnect', (reason) => {
      logger.warn('SOCKET', `Disconnected: ${reason}`);
      setReconnectionState('disconnected');
      lastDisconnectTimeRef.current = Date.now();
    });

    newSocket.on('connect_error', (error) => {
      logger.error('SOCKET', `Connection error: ${error.message}`);
      reportRuntimeError('Socket connection error', error);
    });

    newSocket.on('error', (error) => {
      logger.error('SOCKET', `Socket error: ${error?.message || error}`);
      reportRuntimeError('Socket error', error);
    });

    logger.info('SOCKET', 'Initializing socket connection...');

    return () => {
      logger.info('SOCKET', 'Cleaning up socket connection');
      for (const timeout of reconnectTimeoutsRef.current) {
        clearTimeout(timeout);
      }
      newSocket.disconnect();
    };
  }, []);

  const roomIdRef = useRef(roomId);
  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  const clearRoomId = (id) => {
    if (roomIdRef.current === id) {
      setRoomId(null);
    }
  };

  const clearReconnect = useCallback((prefix) => {
    sessionStorage.removeItem(`${prefix}_reconnect`);
  }, []);

  const leaveRoom = useCallback(
    (prefix, roomId) => {
      socket?.emit(`${prefix}_leaveRoom`, roomId);
      clearReconnect(prefix);
      clearRoomId(roomId);
    },
    [socket, clearReconnect],
  );

  const setPlayerProfileName = (name) => {
    setProfile((prev) => ({ ...prev, name }));
  };

  const handleReconnectFailure = useCallback(
    ({ reason, roomId }) => {
      reconnectAttemptsRef.current++;
      sessionStorage.removeItem(`${gamePrefix}_reconnect`);
    },
    [gamePrefix],
  );

  const value = {
    playerName: profile.name,
    setPlayerName: setPlayerProfileName,
    profile,
    setProfile,
    roomId,
    setRoomId,
    clearRoomId,
    socket,
    gamePrefix,
    setGamePrefix,
    leaveRoom,
    clearReconnect,
    reconnectionState,
    reconnectAttempts: reconnectAttemptsRef.current,
    handleReconnectFailure,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
