import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActiveLink = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { path: "/dashboard", label: "Overview" },
    { path: "/school", label: "By School" },
    { path: "/status", label: "Check Status" }
  ];

  return (
    <>
      <style>
        {`
          .navbar {
            background-color: #ffffff;
            border-bottom: 1px solid #e5e7eb;
            padding: 16px 24px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          }

          .navbar.dark {
            background-color: #1f2937;
            border-bottom: 1px solid #374151;
          }

          .navbar-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 1200px;
            margin: 0 auto;
          }

          .navbar-left {
            display: flex;
            align-items: center;
            gap: 32px;
          }

          .navbar-brand {
            font-size: 20px;
            font-weight: 600;
            color: #111827;
            margin: 0;
          }

          .navbar.dark .navbar-brand {
            color: #ffffff;
          }

          .navbar-links {
            display: flex;
            gap: 4px;
          }

          .nav-link {
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            color: #6b7280;
            transition: all 0.2s ease-in-out;
          }

          .nav-link:hover {
            color: #111827;
            background-color: #f9fafb;
          }

          .nav-link.active {
            background-color: #dbeafe;
            color: #1d4ed8;
          }

          .navbar.dark .nav-link {
            color: #d1d5db;
          }

          .navbar.dark .nav-link:hover {
            color: #ffffff;
            background-color: #374151;
          }

          .navbar.dark .nav-link.active {
            background-color: rgba(30, 58, 138, 0.5);
            color: #93c5fd;
          }

          .navbar-right {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .toggle-btn {
            padding: 8px;
            border-radius: 8px;
            border: 1px solid #d1d5db;
            background-color: #ffffff;
            color: #374151;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .toggle-btn:hover {
            background-color: #f9fafb;
          }

          .navbar.dark .toggle-btn {
            border: 1px solid #4b5563;
            background-color: #1f2937;
            color: #d1d5db;
          }

          .navbar.dark .toggle-btn:hover {
            background-color: #374151;
          }

          .logout-btn {
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 500;
            color: #ffffff;
            background-color: #dc2626;
            border: 1px solid transparent;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
          }

          .logout-btn:hover {
            background-color: #b91c1c;
          }

          .logout-btn:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.5);
          }

          .mobile-menu {
            display: none;
          }

          .mobile-menu-btn {
            padding: 8px;
            border-radius: 8px;
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
          }

          .mobile-menu-btn:hover {
            color: #6b7280;
            background-color: #f3f4f6;
          }

          .navbar.dark .mobile-menu-btn:hover {
            background-color: #374151;
            color: #d1d5db;
          }

          @media (max-width: 768px) {
            .navbar-links {
              display: none;
            }
            
            .mobile-menu {
              display: block;
            }

            .navbar-left {
              gap: 16px;
            }
          }
        `}
      </style>
      <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-left">
          <div className="navbar-brand">
            School Payments
          </div>
          
          {/* Navigation Links */}
          <div className="navbar-links">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link ${isActiveLink(path) ? 'active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side actions */}
        <div className="navbar-right">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="toggle-btn"
            title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            {darkMode ? (
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Logout button */}
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="mobile-menu">
          <button type="button" className="mobile-menu-btn">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        </div>
      </nav>
    </>
  );
}