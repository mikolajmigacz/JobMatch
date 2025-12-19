import { bootstrap } from '@config/bootstrap';
import { createApp } from './app';

async function main() {
  try {
    const { config, dynamoDBClient, sqsClient } = await bootstrap();

    const app = createApp(config, dynamoDBClient, sqsClient);

    app.listen(config.APPLICATION_SERVICE_PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`✅ Application Service running on port ${config.APPLICATION_SERVICE_PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start Application Service:', error);
    process.exit(1);
  }
}

main();
