import {
  SERVICE_NAMES,
  HTTP_TIMEOUTS,
  RETRY_CONFIG,
  ENVIRONMENT_VARIABLES,
} from './service.constants';

export interface HttpClientConfig {
  baseURL: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
}

function getEnvUrl(envVar: string): string {
  const url = process.env[envVar];
  if (!url) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
  return url;
}

export const httpClientConfig: Record<string, HttpClientConfig> = {
  [SERVICE_NAMES.AUTH]: {
    baseURL: getEnvUrl(ENVIRONMENT_VARIABLES.AUTH_SERVICE_URL),
    timeout: HTTP_TIMEOUTS.DEFAULT,
    maxRetries: RETRY_CONFIG.DEFAULT_MAX_RETRIES,
    retryDelay: RETRY_CONFIG.DEFAULT_RETRY_DELAY,
  },
  [SERVICE_NAMES.USER]: {
    baseURL: getEnvUrl(ENVIRONMENT_VARIABLES.USER_SERVICE_URL),
    timeout: HTTP_TIMEOUTS.DEFAULT,
    maxRetries: RETRY_CONFIG.DEFAULT_MAX_RETRIES,
    retryDelay: RETRY_CONFIG.DEFAULT_RETRY_DELAY,
  },
  [SERVICE_NAMES.JOB]: {
    baseURL: getEnvUrl(ENVIRONMENT_VARIABLES.JOB_SERVICE_URL),
    timeout: HTTP_TIMEOUTS.DEFAULT,
    maxRetries: RETRY_CONFIG.DEFAULT_MAX_RETRIES,
    retryDelay: RETRY_CONFIG.DEFAULT_RETRY_DELAY,
  },
  [SERVICE_NAMES.APPLICATION]: {
    baseURL: getEnvUrl(ENVIRONMENT_VARIABLES.APPLICATION_SERVICE_URL),
    timeout: HTTP_TIMEOUTS.DEFAULT,
    maxRetries: RETRY_CONFIG.DEFAULT_MAX_RETRIES,
    retryDelay: RETRY_CONFIG.DEFAULT_RETRY_DELAY,
  },
  [SERVICE_NAMES.EMAIL]: {
    baseURL: getEnvUrl(ENVIRONMENT_VARIABLES.EMAIL_SERVICE_URL),
    timeout: HTTP_TIMEOUTS.DEFAULT,
    maxRetries: RETRY_CONFIG.DEFAULT_MAX_RETRIES,
    retryDelay: RETRY_CONFIG.DEFAULT_RETRY_DELAY,
  },
  [SERVICE_NAMES.CV_ANALYSIS]: {
    baseURL: getEnvUrl(ENVIRONMENT_VARIABLES.CV_ANALYSIS_SERVICE_URL),
    timeout: HTTP_TIMEOUTS.CV_ANALYSIS,
    maxRetries: RETRY_CONFIG.CV_ANALYSIS_MAX_RETRIES,
    retryDelay: RETRY_CONFIG.CV_ANALYSIS_RETRY_DELAY,
  },
};
