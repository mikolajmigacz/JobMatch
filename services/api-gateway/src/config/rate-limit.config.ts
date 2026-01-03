export const RATE_LIMIT_CONFIG = {
  global: {
    ttl: 15 * 60 * 1000,
    limit: 100,
  },
  auth: {
    ttl: 15 * 60 * 1000,
    limit: 5,
  },
  cvAnalysis: {
    ttl: 60 * 60 * 1000,
    limit: 3,
  },
};
