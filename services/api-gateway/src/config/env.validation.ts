import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  API_GATEWAY_PORT: Joi.number().required(),
  CORS_ORIGIN: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  AUTH_SERVICE_URL: Joi.string().uri().required(),
  USER_SERVICE_URL: Joi.string().uri().required(),
  JOB_SERVICE_URL: Joi.string().uri().required(),
  APPLICATION_SERVICE_URL: Joi.string().uri().required(),
  EMAIL_SERVICE_URL: Joi.string().uri().required(),
  CV_ANALYSIS_SERVICE_URL: Joi.string().uri().required(),
  RATE_LIMIT_TTL: Joi.number().required(),
  RATE_LIMIT_MAX: Joi.number().required(),
});
