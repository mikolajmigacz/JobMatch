export interface EnvConfig {
  NODE_ENV: string;
  APPLICATION_SERVICE_PORT: number;
  JWT_SECRET: string;
  CORS_ORIGIN: string;
  DYNAMODB_ENDPOINT: string;
  DYNAMODB_TABLE_APPLICATIONS: string;
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  SQS_ENDPOINT: string;
  SQS_QUEUE_URL: string;
  JOB_SERVICE_URL: string;
  USER_SERVICE_URL: string;
}

export function loadEnvConfig(): EnvConfig {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    APPLICATION_SERVICE_PORT: parseInt(process.env.APPLICATION_SERVICE_PORT || '3004', 10),
    JWT_SECRET: process.env.JWT_SECRET || 'test-secret',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    DYNAMODB_ENDPOINT: process.env.DYNAMODB_ENDPOINT || 'http://localstack:4566',
    DYNAMODB_TABLE_APPLICATIONS: process.env.DYNAMODB_TABLE_APPLICATIONS || 'Applications',
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || 'test',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || 'test',
    SQS_ENDPOINT: process.env.SQS_ENDPOINT || 'http://localstack:4566',
    SQS_QUEUE_URL: process.env.SQS_QUEUE_URL || 'http://localstack:4566/000000000000/email-queue',
    JOB_SERVICE_URL: process.env.JOB_SERVICE_URL || 'http://localhost:3002',
    USER_SERVICE_URL: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  };
}
