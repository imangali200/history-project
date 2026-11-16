import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import LoginPageComponent from '../components/LoginPage';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect straight to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = (userData) => {
    login(userData);
    navigate('/dashboard');
  };

  return <LoginPageComponent onLogin={handleLogin} />;
}
