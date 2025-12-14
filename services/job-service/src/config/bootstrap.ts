import { loadEnvConfig } from '@config/env.config';
import { createDynamoDBClient } from '@infrastructure/dynamodb/client';

export async function bootstrap() {
  const config = loadEnvConfig();
  const dynamoDBClient = createDynamoDBClient(config);

  return {
    config,
    dynamoDBClient,
  };
}
