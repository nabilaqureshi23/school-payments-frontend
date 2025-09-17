import React, { useState } from "react";
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

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {isAuthenticated && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={isAuthenticated ? <Overview /> : <Navigate to="/login" />}
        />
        <Route
          path="/school"
          element={isAuthenticated ? <SchoolTransactions /> : <Navigate to="/login" />}
        />
        <Route
          path="/status"
          element={isAuthenticated ? <CheckStatus /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </div>
  );
}
