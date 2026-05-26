import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useUser } from "@clerk/clerk-react";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useUser();

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (user) {

      const socketInstance = io(
  process.env.REACT_APP_SOCKET_URL || 'https://chat-backend-da9m.onrender.com',
  {
    auth: {
      userId: user.publicMetadata?.mongoUserId || user.id,
      username: user.fullName
    }
  }
);

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
  }, [user]);

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