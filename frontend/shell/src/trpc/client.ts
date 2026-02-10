'use client';

import { createTRPCClient, httpBatchLink } from '@trpc/client';

export function getTRPCClient(token?: string | null) {
  const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
  if (!apiUrl) {
    throw new Error('API Gateway URL not configured');
  }

  return createTRPCClient<any>({
    links: [
      httpBatchLink({
        url: `${apiUrl}/api/trpc`,
        async headers() {
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
            // Token expired - could trigger logout here
            if (typeof window !== 'undefined') {
              const event = new CustomEvent('token-expired');
              window.dispatchEvent(event);
            }
          }

          return response;
        },
      }),
    ],
  });
}
