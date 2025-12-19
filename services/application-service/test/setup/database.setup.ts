import {
  DynamoDBClient,
  CreateTableCommand,
  DeleteTableCommand,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export class TestDatabaseSetup {
  private client: DynamoDBClient;
  private documentClient: DynamoDBDocumentClient;

  constructor() {
    this.client = new DynamoDBClient({
      region: 'us-east-1',
      endpoint: 'http://localhost:4566',
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    });
    this.documentClient = DynamoDBDocumentClient.from(this.client);
  }

  async createTable(): Promise<void> {
    try {
      // Check if table exists
      try {
        await this.client.send(new DescribeTableCommand({ TableName: 'Applications' }));
        // Table exists, skip creation
        return;
      } catch (error) {
        // Table doesn't exist, proceed with creation
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: any = {
        TableName: 'Applications',
        KeySchema: [{ AttributeName: 'applicationId', KeyType: 'HASH' }],
        AttributeDefinitions: [
          { AttributeName: 'applicationId', AttributeType: 'S' },
          { AttributeName: 'jobSeekerId', AttributeType: 'S' },
          { AttributeName: 'jobId', AttributeType: 'S' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
        GlobalSecondaryIndexes: [
          {
            IndexName: 'jobSeekerIdIndex',
            KeySchema: [{ AttributeName: 'jobSeekerId', KeyType: 'HASH' }],
            Projection: { ProjectionType: 'ALL' },
          },
          {
            IndexName: 'jobIdIndex',
            KeySchema: [{ AttributeName: 'jobId', KeyType: 'HASH' }],
            Projection: { ProjectionType: 'ALL' },
          },
        ],
      };

      await this.client.send(new CreateTableCommand(params));
      // Wait for table to be ready
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      throw new Error(`Failed to create DynamoDB table: ${error}`);
    }
  }

  async cleanup(): Promise<void> {
    try {
      await this.client.send(new DeleteTableCommand({ TableName: 'Applications' }));
    } catch (error) {
      // Table might not exist, that's OK
    }
  }

  getDocumentClient(): DynamoDBDocumentClient {
    return this.documentClient;
  }
}
