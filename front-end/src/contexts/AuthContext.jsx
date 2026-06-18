import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getMe();
          setUser(response.user);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    localStorage.setItem('token', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    const meResponse = await authAPI.getMe();
    setUser(meResponse.user);
    return meResponse.user;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isTeacher: user?.role === 'teacher',
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}