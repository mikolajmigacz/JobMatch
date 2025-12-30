// Setup environment variables before tests run
process.env.NODE_ENV = 'test';
process.env.EMAIL_SERVICE_PORT = '3005';
process.env.CORS_ORIGIN = 'http://localhost:4000';
process.env.SMTP_HOST = 'localhost';
process.env.SMTP_PORT = '1025';
process.env.SMTP_SECURE = 'false';
process.env.SMTP_USER = 'test';
process.env.SMTP_PASSWORD = 'test';
process.env.SMTP_FROM = 'test@jobmatch.com';
process.env.DYNAMODB_ENDPOINT = 'http://localhost:4566';
process.env.DYNAMODB_TABLE_EMAILS = 'Emails';
process.env.SQS_ENDPOINT = 'http://localhost:4566';
process.env.SQS_QUEUE_URL = 'http://localhost:4566/000000000000/email-queue';
process.env.AWS_REGION = 'us-east-1';
process.env.AWS_ACCESS_KEY_ID = 'test';
process.env.AWS_SECRET_ACCESS_KEY = 'test';
process.env.LOG_LEVEL = 'error'; // Reduce noise in tests
