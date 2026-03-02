import { QueryClient } from '@tanstack/react-query';
import { TRPCClientError } from '@trpc/client';

const isTRPCError = (error: unknown): error is TRPCClientError<any> => {
  return error instanceof TRPCClientError;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
      retry: (failureCount, error) => {
        if (isTRPCError(error)) {
          const httpStatus = (error.data as { httpStatus?: number })?.httpStatus;
          if (httpStatus && httpStatus >= 400 && httpStatus < 500) return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});
