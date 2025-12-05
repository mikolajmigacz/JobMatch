export interface EnvConfig {
  NODE_ENV: string;
  USER_SERVICE_PORT: number;
  CORS_ORIGIN: string;
  DYNAMODB_ENDPOINT: string;
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  JWT_SECRET: string;
}

export function loadEnvConfig(): EnvConfig {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    USER_SERVICE_PORT: parseInt(process.env.USER_SERVICE_PORT || '3002', 10),
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    DYNAMODB_ENDPOINT: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || 'test',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || 'test',
    JWT_SECRET: process.env.JWT_SECRET || '',
  };
}
