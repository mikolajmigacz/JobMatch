export interface EnvConfig {
  CV_ANALYSIS_SERVICE_PORT: number;
  CORS_ORIGIN: string;
  GEMINI_API_KEY: string;
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  S3_ENDPOINT: string;
  S3_BUCKET: string;
  DYNAMODB_ENDPOINT: string;
  NODE_ENV: string;
  LOG_LEVEL: string;
}

export async function loadEnvConfig(): Promise<EnvConfig> {
  const port = parseInt(process.env.CV_ANALYSIS_SERVICE_PORT || '3006', 10);
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  const geminiKey = process.env.GEMINI_API_KEY || '';
  const awsRegion = process.env.AWS_REGION || 'us-east-1';
  const awsAccessKey = process.env.AWS_ACCESS_KEY_ID || '';
  const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY || '';
  const s3Endpoint = process.env.S3_ENDPOINT || 'http://localhost:4566';
  const s3Bucket = process.env.S3_BUCKET || '';
  const dynamodbEndpoint = process.env.DYNAMODB_ENDPOINT || '';
  const nodeEnv = process.env.NODE_ENV || 'development';
  const logLevel = process.env.LOG_LEVEL || 'info';

  return {
    CV_ANALYSIS_SERVICE_PORT: port,
    CORS_ORIGIN: corsOrigin,
    GEMINI_API_KEY: geminiKey,
    AWS_REGION: awsRegion,
    AWS_ACCESS_KEY_ID: awsAccessKey,
    AWS_SECRET_ACCESS_KEY: awsSecretKey,
    S3_ENDPOINT: s3Endpoint,
    S3_BUCKET: s3Bucket,
    DYNAMODB_ENDPOINT: dynamodbEndpoint,
    NODE_ENV: nodeEnv,
    LOG_LEVEL: logLevel,
  };
}
