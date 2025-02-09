import React from 'react';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const accessToken = localStorage.getItem('access_token');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = userData.level;

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
