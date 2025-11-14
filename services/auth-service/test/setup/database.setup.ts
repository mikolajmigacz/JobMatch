import {
  DynamoDBClient,
  CreateTableCommand,
  ListTablesCommand,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

export class TestDatabaseSetup {
  private readonly dynamoDb: DynamoDBDocumentClient;
  private readonly dynamoDbClient: DynamoDBClient;
  private readonly tableName = 'Users';
  private readonly maxRetries = 5;
  private readonly retryDelayMs = 1000;

  constructor() {
    this.dynamoDbClient = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
      },
    });

    this.dynamoDb = DynamoDBDocumentClient.from(this.dynamoDbClient);
  }

  /**
   * Check if table exists in DynamoDB
   */
  private async tableExists(): Promise<boolean> {
    try {
      const result = await this.dynamoDbClient.send(new ListTablesCommand({}));
      return (result.TableNames || []).includes(this.tableName);
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for table to be active with exponential backoff
   */
  private async waitForTableActive(retries = this.maxRetries): Promise<void> {
    try {
      const result = await this.dynamoDbClient.send(
        new DescribeTableCommand({ TableName: this.tableName })
      );

      if (result.Table?.TableStatus === 'ACTIVE') {
        return;
      }

      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.retryDelayMs));
        await this.waitForTableActive(retries - 1);
      } else {
        throw new Error('Table did not reach ACTIVE status');
      }
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.retryDelayMs));
        await this.waitForTableActive(retries - 1);
      } else {
        throw error;
      }
    }
  }

  /**
   * Create Users table with proper schema and GSI for email lookups
   */
  async createTable(): Promise<void> {
    try {
      const exists = await this.tableExists();
      if (exists) {
        await this.clearTable();
        return;
      }

      await this.dynamoDbClient.send(
        new CreateTableCommand({
          TableName: this.tableName,
          AttributeDefinitions: [
            {
              AttributeName: 'userId',
              AttributeType: 'S',
            },
            {
              AttributeName: 'email',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'userId',
              KeyType: 'HASH',
            },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'email-index',
              KeySchema: [
                {
                  AttributeName: 'email',
                  KeyType: 'HASH',
                },
              ],
              Projection: {
                ProjectionType: 'ALL',
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
              },
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
        })
      );

      await this.waitForTableActive();
    } catch (error) {
      throw new Error(
        `Failed to create test database table: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Clear all items from the table
   */
  async clearTable(): Promise<void> {
    try {
      const result = await this.dynamoDb.send(
        new ScanCommand({
          TableName: this.tableName,
        })
      );

      if (result.Items && result.Items.length > 0) {
        for (const item of result.Items) {
          await this.dynamoDb.send(
            new DeleteCommand({
              TableName: this.tableName,
              Key: { userId: item.userId as string },
            })
          );
        }
      }
    } catch (error) {
      if (!(error instanceof Error && error.message.includes('ResourceNotFoundException'))) {
        console.warn('Failed to clear test table:', error);
      }
    }
  }

  /**
   * Cleanup resources after tests
   */
  async cleanup(): Promise<void> {
    try {
      await this.clearTable();
      this.dynamoDbClient.destroy();
    } catch (error) {
      console.warn('Cleanup error:', error);
    }
  }
}
