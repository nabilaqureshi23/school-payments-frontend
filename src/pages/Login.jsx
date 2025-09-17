import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data && res.data.success) {
        localStorage.setItem("token", res.data.access_token);
        navigate("/");
      } else {
        setError(res.data?.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <>
      <style>
        {`
          .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }

          .login-card {
            background: #ffffff;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            width: 100%;
            max-width: 400px;
            backdrop-filter: blur(10px);
          }

          .login-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            color: #111827;
            text-align: center;
          }

          .login-subtitle {
            color: #6b7280;
            text-align: center;
            margin-bottom: 32px;
            font-size: 14px;
          }

          .error-message {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 6px;
          }

          .form-input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.2s ease-in-out;
            background-color: #ffffff;
            color: #111827;
            box-sizing: border-box;
          }

          .form-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          .form-input::placeholder {
            color: #9ca3af;
          }

          .login-button {
            width: 100%;
            padding: 12px 16px;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: #ffffff;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            margin-top: 8px;
          }

          .login-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            background: linear-gradient(135deg, #2563eb, #1e40af);
          }

          .login-button:active {
            transform: translateY(0);
          }

          .help-text {
            margin-top: 20px;
            padding: 12px 16px;
            background-color: #f3f4f6;
            border-radius: 8px;
            font-size: 13px;
            color: #6b7280;
            text-align: center;
            border-left: 4px solid #3b82f6;
          }

          .brand-logo {
            text-align: center;
            margin-bottom: 32px;
          }

          .brand-text {
            font-size: 24px;
            font-weight: 700;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          @media (max-width: 480px) {
            .login-card {
              padding: 24px;
              margin: 16px;
            }
            
            .login-title {
              font-size: 24px;
            }
          }
        `}
      </style>
      
      <div className="login-container">
        <div className="login-card">
          <div className="brand-logo">
            <div className="brand-text">School Payments</div>
          </div>
          
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to your account to continue</p>
          
          {error && (
            <div className="error-message">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
          
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email" 
                type="email" 
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter your password" 
                type="password" 
                className="form-input"
                required
              />
            </div>
            
            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
          
          <div className="help-text">
            💡 Use an existing user account (created via backend/Postman)
          </div>
        </div>
      </div>
    </>
  );
}