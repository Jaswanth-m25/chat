import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { SocketProvider } from './context/SocketContext';

import LoginSignup from './components/LoginSignup';
import { ChatApp } from './components/Chat';

import './App.css';

import {
  SignedIn,
  SignedOut,
  RedirectToSignIn
} from "@clerk/clerk-react";

const ChatWithProviders = () => {
  return (
    <SocketProvider>
      <ChatApp />
    </SocketProvider>
  );
};

function App() {
  return (
    <Router>
      <Routes>

        {/* Login Page */}
        <Route
          path="/LoginSignup"
          element={
            <>
              <SignedOut>
                <LoginSignup />
              </SignedOut>

              <SignedIn>
                <Navigate to="/chat" />
              </SignedIn>
            </>
          }
        />

        {/* Protected Chat Route */}
        <Route
          path="/chat"
          element={
            <>
              <SignedIn>
                <ChatWithProviders />
              </SignedIn>

              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/chat" />} />

      </Routes>
    </Router>
  );
}

export default App;