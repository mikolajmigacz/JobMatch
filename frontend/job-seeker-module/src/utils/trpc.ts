import { httpBatchLink, loggerLink } from '@trpc/client';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) throw new Error('Missing required environment variable: NEXT_PUBLIC_API_URL');

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
      url: `${apiUrl}/trpc`,
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
