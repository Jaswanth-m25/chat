import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Helper to decode JWT payload without a library
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Restore user from JWT payload on page reload
      if (!user) {
        const decoded = decodeToken(token);
        if (decoded && decoded.user && decoded.user.id) {

  if (decoded.exp && decoded.exp * 1000 < Date.now()) {

    setToken(null);
    setUser(null);
    sessionStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];

  } else {

    setUser({
      id: decoded.user.id
    });
  }

}else {
          // Invalid token, clean up
          setToken(null);
          sessionStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
    }
    setLoading(false);
  }, [token]);

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password
      });
      setToken(response.data.token);
      setUser(response.data.user);
      sessionStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });
      setToken(response.data.token);
      setUser(response.data.user);
      sessionStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
