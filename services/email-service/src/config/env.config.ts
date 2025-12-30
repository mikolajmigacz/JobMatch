export interface EnvConfig {
  NODE_ENV: string;
  EMAIL_SERVICE_PORT: number;
  CORS_ORIGIN: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_SECURE: boolean;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  SMTP_FROM: string;
  DYNAMODB_ENDPOINT: string;
  DYNAMODB_TABLE_EMAILS: string;
  SQS_ENDPOINT: string;
  SQS_QUEUE_URL: string;
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  LOG_LEVEL: string;
}

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getRequiredEnvAsNumber(key: string): number {
  const value = getRequiredEnv(key);
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid number, got: ${value}`);
  }
  return parsed;
}

function getRequiredEnvAsBoolean(key: string): boolean {
  const value = getRequiredEnv(key);
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`Environment variable ${key} must be 'true' or 'false', got: ${value}`);
}

export function loadEnvConfig(): EnvConfig {
  return {
    NODE_ENV: getRequiredEnv('NODE_ENV'),
    EMAIL_SERVICE_PORT: getRequiredEnvAsNumber('EMAIL_SERVICE_PORT'),
    CORS_ORIGIN: getRequiredEnv('CORS_ORIGIN'),
    SMTP_HOST: getRequiredEnv('SMTP_HOST'),
    SMTP_PORT: getRequiredEnvAsNumber('SMTP_PORT'),
    SMTP_SECURE: getRequiredEnvAsBoolean('SMTP_SECURE'),
    SMTP_USER: getRequiredEnv('SMTP_USER'),
    SMTP_PASSWORD: getRequiredEnv('SMTP_PASSWORD'),
    SMTP_FROM: getRequiredEnv('SMTP_FROM'),
    DYNAMODB_ENDPOINT: getRequiredEnv('DYNAMODB_ENDPOINT'),
    DYNAMODB_TABLE_EMAILS: getRequiredEnv('DYNAMODB_TABLE_EMAILS'),
    SQS_ENDPOINT: getRequiredEnv('SQS_ENDPOINT'),
    SQS_QUEUE_URL: getRequiredEnv('SQS_QUEUE_URL'),
    AWS_REGION: getRequiredEnv('AWS_REGION'),
    AWS_ACCESS_KEY_ID: getRequiredEnv('AWS_ACCESS_KEY_ID'),
    AWS_SECRET_ACCESS_KEY: getRequiredEnv('AWS_SECRET_ACCESS_KEY'),
    LOG_LEVEL: getRequiredEnv('LOG_LEVEL'),
  };
}
