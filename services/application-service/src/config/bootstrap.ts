import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { SQSClient } from '@aws-sdk/client-sqs';
import { loadEnvConfig } from './env.config';

export interface BootstrapResult {
  config: ReturnType<typeof loadEnvConfig>;
  dynamoDBClient: DynamoDBDocumentClient;
  sqsClient: SQSClient;
}

export async function bootstrap(): Promise<BootstrapResult> {
  const config = loadEnvConfig();

  const dynamoDBClient = DynamoDBDocumentClient.from(
    new DynamoDBClient({
      endpoint: config.DYNAMODB_ENDPOINT,
      region: config.AWS_REGION,
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      },
    })
  );

  const sqsClient = new SQSClient({
    endpoint: config.SQS_ENDPOINT,
    region: config.AWS_REGION,
    credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    },
  });

  return {
    config,
    dynamoDBClient,
    sqsClient,
  };
}
