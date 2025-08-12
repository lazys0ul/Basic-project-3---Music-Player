import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const API_BASE = `${BACKEND_URL}/api`;

  // Set up axios defaults and interceptors
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }

    // Request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        config.timeout = 10000; // 10 second timeout
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          logout();
          toast.error('Session expired. Please log in again.');
        } else if (error.code === 'ECONNABORTED') {
          toast.error('Request timeout. Please check your connection.');
        } else if (!error.response) {
          toast.error('Network error. Please check your connection.');
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  const isAuthenticated = !!token && !!user;

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        const { user: userData, token: userToken } = response.data;
        
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        toast.success('Login successful!');
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, adminCode = '') => {
    setLoading(true);
    try {
      const requestData = {
        username,
        email,
        password
      };

      // Only include adminCode if it's provided and not empty
      if (adminCode && adminCode.trim()) {
        requestData.adminCode = adminCode.trim();
      }

      const response = await axios.post(`${API_BASE}/auth/register`, requestData);

      if (response.data.success) {
        const { user: userData, token: userToken } = response.data;
        
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Show different success message for admin registration
        if (userData.role === 'admin') {
          toast.success('🎉 Admin registration successful! Welcome to Resona!');
        } else {
          toast.success('Registration successful!');
        }
        return { success: true };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    toast.info('Logged out successfully');
  };

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        // Clear invalid data if parsing fails
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };