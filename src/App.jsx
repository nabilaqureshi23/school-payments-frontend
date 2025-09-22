import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import SchoolTransactions from "./pages/SchoolTransactions";
import CheckStatus from "./pages/CheckStatus";
import Navbar from "./components/Navbar";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // 🔹 Token in state
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const isAuthenticated = !!token;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Routes>
        {/* Public Route - Login */}
        <Route path="/" element={<Login setToken={setToken} />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <>
                <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
                <Overview />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/school"
          element={
            isAuthenticated ? (
              <>
                <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
                <SchoolTransactions />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/status"
          element={
            isAuthenticated ? (
              <>
                <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
                <CheckStatus />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
      </Routes>
    </div>
  );
}
