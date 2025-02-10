import React from 'react';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRoles }) => {
  const accessToken = localStorage.getItem('access_token');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = userData.level;

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
