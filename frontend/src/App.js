import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import axios from 'axios';

import {
  useUser,
  SignedIn,
  SignedOut,
  RedirectToSignIn
} from "@clerk/clerk-react";

import { SocketProvider } from './context/SocketContext';
import AboutPage from './components/AboutPage';
import LoginSignup from './components/LoginSignup';
import Signup from "./components/SignUp";
import HomePage from './components/HomePage';
import { ChatApp } from './components/Chat';

import './App.css';

const ChatWithProviders = () => {
  return (
    <SocketProvider>
      <ChatApp />
    </SocketProvider>
  );
};

function App() {

  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {

    const syncUser = async () => {

      if (!user) return;

      try {

        console.log("SYNCING USER");

        const response = await axios.post(
          'https://chat-backend-da9m.onrender.com/api/clerk/sync-user',
          {
            clerkId: user.id,
            username: user.fullName,
            email: user.primaryEmailAddress?.emailAddress,
            avatar: user.imageUrl
          }
        );

        localStorage.setItem(
          "mongoUser",
          JSON.stringify(response.data.user)
        );

        console.log(response.data);

      } catch (error) {

        console.error("SYNC ERROR", error);

      }

    };

    if (isSignedIn) {
      syncUser();
    }

  }, [isSignedIn, user]);

  // Prevent flicker while Clerk loads
  if (!isLoaded) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#0f172a',
          color: 'white',
          fontSize: '1.2rem'
        }}
      >
        Loading...
      </div>
    );
  }

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
                <Navigate to="/chat" replace />
              </SignedIn>
            </>
          }
        />
        <Route
  path="/signup"
  element={
    <>
      <SignedOut>
        <Signup />
      </SignedOut>

      <SignedIn>
        <Navigate to="/chat" />
      </SignedIn>
    </>
  }
/>

        {/* Chat Page */}
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
        <Route
  path="/about"
  element={<AboutPage />}
/>
        {/* Home Page */}
        <Route
          path="/"
          element={
            isSignedIn
              ? <Navigate to="/chat" replace />
              : <HomePage />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;