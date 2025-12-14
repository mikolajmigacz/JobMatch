import 'dotenv/config';
import 'reflect-metadata';
import { bootstrap } from '@config/bootstrap';
import { createApp } from './app';

async function start() {
  const { config } = await bootstrap();
  const app = createApp(config);

  // eslint-disable-next-line no-console
  app.listen(config.JOB_SERVICE_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`✅ Job Service running on port ${config.JOB_SERVICE_PORT}`);
    // eslint-disable-next-line no-console
    console.log(`✅ tRPC ready at http://localhost:${config.JOB_SERVICE_PORT}/trpc`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('❌ Failed to start Job Service:', err);
  process.exit(1);
});
