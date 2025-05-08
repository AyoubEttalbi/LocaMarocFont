import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';
import Cookies from 'js-cookie';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to normalize user object to always have roles as array
  const normalizeUser = (userObj) => {
    if (!userObj) return null;
    // If roles is missing, set to empty array
    let roles = [];
    if (userObj.roles) {
      // If roles is an object (from backend eager load), convert to array
      if (Array.isArray(userObj.roles)) {
        roles = userObj.roles;
      } else if (typeof userObj.roles === 'object') {
        roles = Object.values(userObj.roles);
      }
    }
    return { ...userObj, roles };
  };

  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (Cookies.get('access_token')) {
          const response = await authService.getUser();
          // The backend may return { user: {...}, ... }
          const userData = response.data.user || response.data;
          setUser(normalizeUser(userData));
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        Cookies.remove('access_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      await authService.csrf();
      const response = await authService.login(credentials);
      if (response.data.token) {
        Cookies.set('access_token', response.data.token, { 
          expires: credentials.remember ? 30 : 1,
          path: '/'
        });
      }
      // The backend may return { user: {...}, ... }
      const userData = response.data.user || response.data;
      setUser(normalizeUser(userData));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      await authService.csrf();
      const response = await authService.register(userData);
      if (response.data.token) {
        Cookies.set('access_token', response.data.token, { 
          expires: 1, // Default to 1 day
          path: '/'
        });
      }
      // The backend may return { user: {...}, ... }
      const userObj = response.data.user || response.data;
      setUser(normalizeUser(userObj));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      Cookies.remove('access_token', { path: '/' });
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
      Cookies.remove('access_token', { path: '/' });
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    setUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};