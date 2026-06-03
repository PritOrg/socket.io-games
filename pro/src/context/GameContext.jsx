import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import logger from '../utils/logger';

const GameContext = createContext();

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [playerName, setPlayerName] = useState('');
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
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    if (savedName) setPlayerName(savedName);
  }, []);

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
    });

    newSocket.on('disconnect', (reason) => {
      logger.warn('SOCKET', `Disconnected: ${reason}`);
    });

    newSocket.on('connect_error', (error) => {
      logger.error('SOCKET', `Connection error: ${error.message}`);
    });

    logger.info('SOCKET', 'Initializing socket connection...');

    return () => {
      logger.info('SOCKET', 'Cleaning up socket connection');
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (playerName) {
      localStorage.setItem('playerName', playerName);
    }
  }, [playerName]);

  const roomIdRef = useRef(roomId);
  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  const clearRoomId = (id) => {
    if (roomIdRef.current === id) {
      setRoomId(null);
    }
  };

  const setPlayerProfileName = (name) => {
    setProfile((prev) => ({ ...prev, name }));
    setPlayerName(name);
  };

  const value = {
    playerName,
    setPlayerName: setPlayerProfileName,
    profile,
    setProfile,
    roomId,
    setRoomId,
    clearRoomId,
    socket,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
