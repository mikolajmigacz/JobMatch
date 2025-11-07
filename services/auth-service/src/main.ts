import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:4000'],
    credentials: true,
  });

  const port = parseInt(process.env.AUTH_SERVICE_PORT || '3001', 10);

  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`✅ Auth Service running on port ${port}`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start Auth Service:', err);
  process.exit(1);
});
