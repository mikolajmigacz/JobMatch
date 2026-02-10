'use client';

import { useAuth } from '@/contexts/auth.context';
import { useCallback } from 'react';

export function useAuthFetch() {
  const { token } = useAuth();

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      return fetch(url, {
        ...options,
        headers,
      });
    },
    [token]
  );

  return authFetch;
}
