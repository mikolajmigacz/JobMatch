import { httpBatchLink, loggerLink } from '@trpc/client';

const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const trpcClient: {
  links: any[];
} = {
  links: [
    loggerLink({
      enabled: () => process.env.NODE_ENV === 'development',
    }),
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/trpc',
      headers: () => {
        const token = getToken();
        return token ? { authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
};

export type AppRouter = any;
export type RouterInputs = any;
export type RouterOutputs = any;
