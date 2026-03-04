'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { PublicUser, LoginRequest, RegisterRequest, AuthResponse } from '@jobmatch/shared';
import { useValidation } from '../utils/useValidation';

interface AuthState {
  user: PublicUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  logout: () => void;
  register: (data: RegisterRequest, logoFile?: File) => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { validateLogin, validateJobSeekerRegister, validateEmployerRegister } = useValidation();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const loadUserFromStorage = useCallback(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const userJson = localStorage.getItem(USER_KEY);

      if (token && userJson) {
        const user = JSON.parse(userJson) as PublicUser;
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleTokenExpired = () => logout();
    window.addEventListener('token-expired', handleTokenExpired);
    return () => window.removeEventListener('token-expired', handleTokenExpired);
  }, [logout]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const validation = validateLogin(credentials);

      if (!validation.success) {
        throw new Error(Object.values(validation.errors || {}).join(', '));
      }

      setState((prev) => ({ ...prev, isLoading: true }));

      const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
      if (!apiUrl) {
        throw new Error('API Gateway URL not configured');
      }

      try {
        const response = await fetch(`${apiUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validation.data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Login failed');
        }

        const data: AuthResponse = await response.json();

        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        setState({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          isLoading: false,
        });
        return data;
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    [validateLogin]
  );

  const register = useCallback(
    async (data: RegisterRequest, logoFile?: File) => {
      const validation =
        data.role === 'job_seeker'
          ? validateJobSeekerRegister(data)
          : validateEmployerRegister(data);

      if (!validation.success || !validation.data) {
        throw new Error(Object.values(validation.errors || {}).join(', '));
      }

      setState((prev) => ({ ...prev, isLoading: true }));

      const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
      if (!apiUrl) {
        throw new Error('API Gateway URL not configured');
      }

      try {
        const endpoint =
          validation.data.role === 'job_seeker'
            ? '/api/auth/register/job-seeker'
            : '/api/auth/register/employer';

        let response: Response;
        if (validation.data.role === 'employer' && logoFile) {
          const formData = new FormData();
          formData.append('email', validation.data.email);
          formData.append('password', validation.data.password);
          formData.append('firstName', validation.data.firstName);
          formData.append('lastName', validation.data.lastName);
          formData.append('role', validation.data.role);
          formData.append('companyName', validation.data.companyName);
          formData.append('companyLogo', logoFile);
          response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'POST',
            body: formData,
          });
        } else if (validation.data.role === 'job_seeker') {
          response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validation.data),
          });
        } else {
          response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validation.data),
          });
        }

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Registration failed');
        }

        const authData: AuthResponse = await response.json();

        localStorage.setItem(TOKEN_KEY, authData.token);
        localStorage.setItem(USER_KEY, JSON.stringify(authData.user));

        setState({
          user: authData.user,
          token: authData.token,
          isAuthenticated: true,
          isLoading: false,
        });
        return authData;
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    [validateJobSeekerRegister, validateEmployerRegister]
  );

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
