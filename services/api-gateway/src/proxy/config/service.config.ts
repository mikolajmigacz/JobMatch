import { ServiceType } from '../types/service.types';

export interface ServiceConfig {
  name: string;
  baseURL: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  type: ServiceType;
  routePrefix: string;
  pathPrefix?: string; // For REST services that need path prefix (e.g., /auth)
}

export const SERVICE_REGISTRY: Record<string, ServiceConfig> = {
  auth: {
    name: 'auth-service',
    baseURL: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    timeout: 5000,
    maxRetries: 3,
    retryDelay: 1000,
    type: 'rest',
    routePrefix: '/api/auth',
    pathPrefix: '/auth', // All requests forwarded to /auth/*
  },
  user: {
    name: 'user-service',
    baseURL: process.env.USER_SERVICE_URL || 'http://localhost:3002',
    timeout: 5000,
    maxRetries: 3,
    retryDelay: 1000,
    type: 'trpc',
    routePrefix: '/api/users',
  },
  job: {
    name: 'job-service',
    baseURL: process.env.JOB_SERVICE_URL || 'http://localhost:3003',
    timeout: 5000,
    maxRetries: 3,
    retryDelay: 1000,
    type: 'trpc',
    routePrefix: '/api/jobs',
  },
  application: {
    name: 'application-service',
    baseURL: process.env.APPLICATION_SERVICE_URL || 'http://localhost:3004',
    timeout: 5000,
    maxRetries: 3,
    retryDelay: 1000,
    type: 'trpc',
    routePrefix: '/api/applications',
  },
  email: {
    name: 'email-service',
    baseURL: process.env.EMAIL_SERVICE_URL || 'http://localhost:3005',
    timeout: 5000,
    maxRetries: 3,
    retryDelay: 1000,
    type: 'rest',
    routePrefix: '/api/email',
  },
  cvAnalysis: {
    name: 'cv-analysis-service',
    baseURL: process.env.CV_ANALYSIS_SERVICE_URL || 'http://localhost:3006',
    timeout: 30000,
    maxRetries: 2,
    retryDelay: 1000,
    type: 'rest',
    routePrefix: '/api/cv-analysis',
  },
};

export function getServiceConfig(serviceKey: string): ServiceConfig {
  const config = SERVICE_REGISTRY[serviceKey];
  if (!config) {
    throw new Error(`Service configuration not found for: ${serviceKey}`);
  }
  return config;
}

export function getAllServices(): ServiceConfig[] {
  return Object.values(SERVICE_REGISTRY);
}
