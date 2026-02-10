'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCClient } from '@trpc/client';
import { useAuth } from '../contexts/auth.context';

export type TRPCClient = ReturnType<typeof createTRPCClient>;

interface TRPCContextValue {
  client: TRPCClient;
}

const TRPCContext = createContext<TRPCContextValue | undefined>(undefined);

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: (failureCount, error: any) => {
              if (error?.data?.code === 'UNAUTHORIZED' || error?.data?.code === 'FORBIDDEN') {
                return false;
              }
              return failureCount < 3;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            retry: (failureCount, error: any) => {
              if (error?.data?.code === 'UNAUTHORIZED' || error?.data?.code === 'FORBIDDEN') {
                return false;
              }
              return failureCount < 1;
            },
          },
        },
      })
  );

  const [trpcClient] = useState(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
    if (!apiUrl) {
      throw new Error('API Gateway URL not configured');
    }

    return createTRPCClient<any>({
      links: [
        loggerLink({
          enabled: () => process.env.NODE_ENV === 'development',
        }),
        httpBatchLink({
          url: `${apiUrl}/api/trpc`,
          headers: () => {
            const headers: Record<string, string> = {
              'Content-Type': 'application/json',
            };

            if (token) {
              headers.Authorization = `Bearer ${token}`;
            }

            return headers;
          },
          fetch: async (url, options) => {
            const response = await fetch(url, options);

            if (response.status === 401) {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('token-expired'));
              }
            }

            return response;
          },
        }),
      ],
    });
  });

  useEffect(() => {
    if (token) {
      queryClient.refetchQueries();
    } else {
      queryClient.clear();
    }
  }, [token, queryClient]);

  return (
    <TRPCContext.Provider value={{ client: trpcClient }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TRPCContext.Provider>
  );
}

export function useTRPCClient() {
  const context = useContext(TRPCContext);
  if (!context) {
    throw new Error('useTRPCClient must be used within TRPCProvider');
  }
  return context.client;
}
