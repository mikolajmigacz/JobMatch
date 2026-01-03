import type { INestApplication } from '@nestjs/common';
import {
  CORS_ALLOWED_HEADERS,
  HTTP_METHODS,
  CORS_CONFIG_STRINGS,
} from '@/shared/constants/headers.constants';

export function configureCors(app: INestApplication): void {
  const corsOrigin = process.env.CORS_ORIGIN;

  if (!corsOrigin) {
    throw new Error(CORS_CONFIG_STRINGS.CORS_NOT_SET);
  }

  app.enableCors({
    origin: corsOrigin.split(',').map((origin) => origin.trim()),
    methods: [
      HTTP_METHODS.GET,
      HTTP_METHODS.POST,
      HTTP_METHODS.PUT,
      HTTP_METHODS.DELETE,
      HTTP_METHODS.OPTIONS,
    ],
    allowedHeaders: [...CORS_ALLOWED_HEADERS],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
}
