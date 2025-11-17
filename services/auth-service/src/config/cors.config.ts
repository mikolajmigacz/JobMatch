import type { INestApplication } from '@nestjs/common';

export function configureCors(app: INestApplication): void {
  const corsOrigin = process.env.CORS_ORIGIN as string;

  if (!corsOrigin) {
    throw new Error('CORS_ORIGIN environment variable is not set');
  }

  app.enableCors({
    origin: corsOrigin.split(',').map((origin) => origin.trim()),
    credentials: true,
  });
}
