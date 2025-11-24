import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          // Fetch user data to verify token and populate user state
          const response = await userAPI.getMe();
          if (response.user) {
            setUser(response.user);
          }
        } catch (err) {
          // Token is invalid, clear it
          localStorage.removeItem('accessToken');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const signup = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      await authAPI.signup(userData);
      // After successful signup, automatically sign in
      const signinResponse = await authAPI.signin({
        username: userData.username,
        password: userData.password,
      });
      setUser({ username: userData.username, displayName: userData.displayName });
      return { success: true, data: signinResponse };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signin = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.signin(credentials);
      // Fetch user data after successful login
      try {
        const userResponse = await userAPI.getMe();
        if (userResponse.user) {
          setUser(userResponse.user);
        } else {
          setUser({ username: credentials.username });
        }
      } catch (userErr) {
        // If getMe fails, still set basic user info
        setUser({ username: credentials.username });
      }
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid username or password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signout = async () => {
    try {
      setError(null);
      await authAPI.signout();
      setUser(null);
      localStorage.removeItem('accessToken'); // Ensure token is cleared
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Signout failed';
      setError(errorMessage);
      // Clear token even if API call fails
      localStorage.removeItem('accessToken');
      setUser(null);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    setUser,
    loading,
    error,
    signup,
    signin,
    signout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

