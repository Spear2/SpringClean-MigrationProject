// App.js
import "./App.css";
import React from "react";
import AppRoutes from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
