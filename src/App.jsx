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

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - With Navbar */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <>
                <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
                <Overview />
              </>
            ) : (
              <Navigate to="/login" />
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
              <Navigate to="/login" />
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
              <Navigate to="/login" />
            )
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </div>
  );
}
