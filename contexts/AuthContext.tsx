
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User, ApiError, LoginCredentials, RegisterPayload } from '../types';
import * as apiService from '../services/apiService';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterPayload) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = useCallback(async () => {
    if (token && !user) { // Fetch only if token exists and user is not already set
      setIsLoading(true);
      try {
        const currentUser = await apiService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        // Token might be invalid, clear it
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false); // No token or user already loaded
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Dependency on token is correct here

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const { token: newToken } = await apiService.loginUser(credentials);
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      // Fetch user data after setting token
      const currentUser = await apiService.getCurrentUser(); // Assumes getCurrentUser uses the new token implicitly or you pass it
      setUser(currentUser);
      toast.success('Logged in successfully!');
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || 'Login failed. Please check your credentials.');
      throw error; // Re-throw for form error handling
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterPayload) => {
    setIsLoading(true);
    try {
      await apiService.registerUser(userData);
      toast.success('Registration successful! Please log in.');
      // Optionally, log the user in directly or redirect to login page
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessages = apiError.errors ? Object.values(apiError.errors).flat().join(', ') : apiError.message;
      toast.error(errorMessages || 'Registration failed. Please try again.');
      throw error; // Re-throw for form error handling
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
