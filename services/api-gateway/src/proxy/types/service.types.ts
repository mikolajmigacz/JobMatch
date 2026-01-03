export type ServiceType = 'rest' | 'trpc';

export interface ProxyRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  data?: unknown;
  params?: Record<string, unknown>;
}

export interface ProxyResponse<T = unknown> {
  status: number;
  data: T;
}
