export function validateRequiredEnvVars(): void {
  const requiredVars = [
    'AUTH_SERVICE_PORT',
    'CORS_ORIGIN',
    'DYNAMODB_ENDPOINT',
    'AWS_REGION',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'S3_ENDPOINT',
    'S3_BUCKET',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
  ];

  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      throw new Error(`Environment variable ${varName} is not defined`);
    }
  }
}
