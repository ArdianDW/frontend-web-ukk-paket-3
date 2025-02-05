import React from 'react';
import { Navigate } from 'react-router-dom';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const accessToken = localStorage.getItem('access_token');

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
