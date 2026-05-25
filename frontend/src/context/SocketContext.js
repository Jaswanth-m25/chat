import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (token && user) {
      const socketInstance = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token
        }
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected');
      });

      socketInstance.on('onlineUsers', (users) => {
        setOnlineUsers(users);
      });

      socketInstance.on('usersTyping', (users) => {
        setTypingUsers(users);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [token, user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, typingUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
