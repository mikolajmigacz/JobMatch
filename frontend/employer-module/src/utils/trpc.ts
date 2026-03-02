import { httpBatchLink, loggerLink } from '@trpc/client';
import { getToken } from './token';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) throw new Error('Missing required environment variable: NEXT_PUBLIC_API_URL');

export const trpcClient: {
  links: ReturnType<typeof httpBatchLink | typeof loggerLink>[];
} = {
  links: [
    loggerLink({
      enabled: () => process.env.NODE_ENV === 'development',
    }),
    httpBatchLink({
      url: `${apiUrl}/trpc`,
      headers: () => {
        const token = getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
};

export type AppRouter = any;
export type RouterInputs = any;
export type RouterOutputs = any;
