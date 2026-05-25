import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
// import { Login, Register } from './components/Auth';
import LoginSignup from './components/LoginSignup';
import { ChatApp } from './components/Chat';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/LoginSignup" />;
  }

  return children;
};

const ChatWithProviders = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <SocketProvider>
      <ChatApp onLogout={handleLogout} />
    </SocketProvider>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/LoginSignup' element={<LoginSignup/>} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatWithProviders />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/chat" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
