import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { EnvConfig } from '@config/env.config';

export function createDynamoDBToolboxClient(config: EnvConfig): DynamoDBDocumentClient {
  const dynamodb = new DynamoDB({
    region: config.AWS_REGION,
    endpoint: config.DYNAMODB_ENDPOINT,
    credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    },
  });

  return DynamoDBDocumentClient.from(dynamodb, {
    marshallOptions: {
      removeUndefinedValues: true,
    },
  });
}
