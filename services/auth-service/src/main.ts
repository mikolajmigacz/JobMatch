import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigin = process.env.CORS_ORIGIN as string;
  app.enableCors({
    origin: corsOrigin.split(','),
    credentials: true,
  });

  const port = parseInt(process.env.AUTH_SERVICE_PORT as string, 10);

  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`✅ Auth Service running on port ${port}`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start Auth Service:', err);
  process.exit(1);
});
