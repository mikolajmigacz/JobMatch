/**
 * Jest setup file - configures environment variables before any test files are loaded
 * This runs before module resolution and imports
 */

// Set all required environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.CORS_ORIGIN = 'http://localhost:4000';
process.env.API_GATEWAY_PORT = '3000';
process.env.AUTH_SERVICE_URL = 'http://localhost:3001';
process.env.USER_SERVICE_URL = 'http://localhost:3002';
process.env.JOB_SERVICE_URL = 'http://localhost:3003';
process.env.APPLICATION_SERVICE_URL = 'http://localhost:3004';
process.env.EMAIL_SERVICE_URL = 'http://localhost:3005';
process.env.CV_ANALYSIS_SERVICE_URL = 'http://localhost:3006';
process.env.RATE_LIMIT_TTL = '900000';
process.env.RATE_LIMIT_MAX = '100';
