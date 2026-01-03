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

  configureMiddleware(app);
  configureCors(app);

  const port = parseInt(process.env.API_GATEWAY_PORT as string, 10);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`✅ API Gateway running on port ${port}`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start API Gateway:', err);
  process.exit(1);
});
