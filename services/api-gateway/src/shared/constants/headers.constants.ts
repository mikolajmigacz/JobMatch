export const ALLOWED_HEADERS = [
  'authorization',
  'content-type',
  'accept',
  'content-length',
] as const;

export const CORS_ALLOWED_HEADERS = ['Content-Type', 'Authorization'] as const;

export const HEADER_NAMES = {
  AUTHORIZATION: 'authorization',
  CONTENT_TYPE: 'content-type',
  ACCEPT: 'accept',
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
} as const;

export const CORS_CONFIG_STRINGS = {
  CORS_NOT_SET: 'CORS_ORIGIN environment variable is not set',
} as const;
