import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { SocketProvider } from './context/SocketContext';

import LoginSignup from './components/LoginSignup';
import HomePage from './components/HomePage';
import { ChatApp } from './components/Chat';
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import axios from "axios";
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

  const { user, isSignedIn } = useUser();

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

        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

      </Routes>
    </Router>
  );
}

export default App;