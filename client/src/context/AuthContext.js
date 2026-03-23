import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        // Set user from localStorage immediately (optimistic)
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Verify with server
        const response = await api.get('/auth/me');
        
        // Update with fresh data from server
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Auth check failed:', error.response?.data || error.message);
        
        // Only clear if it's actually an auth error
        if (error.response?.status === 401) {
          console.log('Token invalid, clearing auth');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        } else {
          // Keep the user logged in for other errors (network issues, etc)
          console.log('Non-auth error, keeping user logged in');
        }
      }
    } else {
      console.log('No auth credentials found');
    }
    setLoading(false);
  };

const login = (userData) => {
  setUser(userData);
  setLoading(false);
};

  const logout = async () => {
    try {
      // Call logout endpoint
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};