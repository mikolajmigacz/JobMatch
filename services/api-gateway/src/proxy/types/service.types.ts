export type ServiceType = 'rest' | 'trpc';

export interface ProxyRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  data?: any;
  params?: any;
}

export interface ProxyResponse<T = any> {
  status: number;
  data: T;
}
