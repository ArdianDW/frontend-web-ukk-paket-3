import { useState } from 'react';
import { login } from '../api/auth';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  nama_petugas: string;
  level: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('access_token');
  });
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await login(username, password);
      const { access, refresh, petugas } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(petugas));
      setUser(petugas);
      setIsAuthenticated(true);
      return null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { error: 'Login failed' };
      } else {
        return { error: (error as Error).message || 'An unexpected error occurred' };
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, user, handleLogin, handleLogout };
};
