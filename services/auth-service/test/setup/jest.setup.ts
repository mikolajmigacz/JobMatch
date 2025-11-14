process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';
process.env.AWS_REGION = process.env.AWS_REGION || 'us-east-1';
process.env.S3_ENDPOINT = process.env.S3_ENDPOINT || 'http://localhost:4566';
process.env.S3_BUCKET = process.env.S3_BUCKET || 'test-jobmatch-bucket';
process.env.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || 'test';
process.env.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || 'test';
process.env.JWT_SECRET =
  process.env.JWT_SECRET || 'test-secret-key-for-integration-tests-do-not-use-in-production';
