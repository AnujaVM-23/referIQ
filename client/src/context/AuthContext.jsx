// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data.user);
          setProfile(response.data.profile);
          localStorage.setItem('auth_user', JSON.stringify(response.data.user));
        } catch (error) {
          const status = error.response?.status;
          if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('auth_user');
            setToken(null);
            setUser(null);
          } else {
            console.warn('Auth initialization failed due to network/server issue. Keeping local session.', error.message);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password, role) => {
    try {
      const response = await authAPI.register(email, password, role);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('auth_user');
      setToken(null);
      setUser(null);
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        profile,
        setProfile,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
