import 'dotenv/config';
import 'tsconfig-paths/register';
import { loadEnvConfig } from '@config/env.config';
import { createApp } from './app';

async function start() {
  const config = await loadEnvConfig();
  const app = await createApp(config);

  app.listen(config.CV_ANALYSIS_SERVICE_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`✅ CV Analysis Service running on port ${config.CV_ANALYSIS_SERVICE_PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('❌ Failed to start CV Analysis Service:', err);
  process.exit(1);
});
