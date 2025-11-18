import 'dotenv/config';
import 'reflect-metadata';
import { bootstrap } from '@config/bootstrap';
import { createApp } from './app';

async function start() {
  const { config, userRepository } = await bootstrap();
  const app = createApp(config, userRepository);

  // eslint-disable-next-line no-console
  app.listen(config.USER_SERVICE_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`✅ User Service running on port ${config.USER_SERVICE_PORT}`);
    // eslint-disable-next-line no-console
    console.log(`✅ tRPC ready at http://localhost:${config.USER_SERVICE_PORT}/trpc`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('❌ Failed to start User Service:', err);
  process.exit(1);
});
