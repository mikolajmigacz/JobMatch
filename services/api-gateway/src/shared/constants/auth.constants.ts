export const PUBLIC_ROUTES = {
  HEALTH: '/health',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGIN: '/api/auth/login',
} as const;

export const ERROR_MESSAGES = {
  MISSING_AUTH_HEADER: 'Missing or invalid authorization header',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token',
} as const;

export const JWT_ERROR_NAMES = {
  TOKEN_EXPIRED: 'TokenExpiredError',
  JWT_MALFORMED: 'JsonWebTokenError',
} as const;

export const JWT_CONFIG = {
  BEARER_PREFIX: 'Bearer ',
} as const;
