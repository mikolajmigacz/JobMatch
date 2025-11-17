import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  AUTH_SERVICE_PORT: Joi.number().default(3001),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  S3_ENDPOINT: Joi.string().uri().required(),
  S3_BUCKET: Joi.string().required(),
  DYNAMODB_ENDPOINT: Joi.string().uri().required(),
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
