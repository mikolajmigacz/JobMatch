import 'reflect-metadata';
import 'tsconfig-paths/register';
import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureMiddleware } from '@config/middleware.config';
import { configureCors } from '@config/cors.config';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure HTTP and CORS
  configureMiddleware(app);
  configureCors(app);

  // Start server
  const port = parseInt(process.env.AUTH_SERVICE_PORT as string, 10);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`✅ Auth Service running on port ${port}`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start Auth Service:', err);
  process.exit(1);
});
