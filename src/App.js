import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Router from "./Router";
import "tailwindcss/dist/base.min.css";
import { LanguageProvider } from "./contexts/LanguageContext";
import { auth } from "./firebase.config";
import UserContextProvider from "./contexts/UserContext";
import VideosContextProvider from "./contexts/VideosContext";

const App = () => {
  window.onunload = () => {
    auth.signOut();
    localStorage.clear();
  };

  return (
    <AuthProvider>
      <LanguageProvider>
        <UserContextProvider>
          <VideosContextProvider>
            <Router />
          </VideosContextProvider>
        </UserContextProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
