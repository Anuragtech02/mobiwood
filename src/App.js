import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Router from "./Router";
import "tailwindcss/dist/base.min.css";
import { LanguageProvider } from "./contexts/LanguageContext";
import { auth } from "./firebase.config";

const App = () => {
  window.onunload = () => {
    auth.signOut();
    localStorage.clear();
  }
  
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router />
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
