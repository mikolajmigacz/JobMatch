import { loadEnvConfig } from '@config/env.config';
import { createDynamoDBClient } from '@infrastructure/dynamodb/client';
import { UserRepository } from '@domain/repositories/user.repository';

export async function bootstrap() {
  const config = loadEnvConfig();
  const dynamoDBClient = createDynamoDBClient(config);
  const userRepository = new UserRepository(dynamoDBClient);

  return {
    config,
    userRepository,
  };
}
