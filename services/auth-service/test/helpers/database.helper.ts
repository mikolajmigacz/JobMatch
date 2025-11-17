import { DynamoDBClient, ScanCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';

/**
 * Database helper utilities for test setup and cleanup
 */
export class DatabaseHelper {
  private dynamoClient: DynamoDBClient;
  private readonly tableName = 'Users'; // Adjust based on your actual table name
  private readonly region = process.env.AWS_REGION || 'us-east-1';
  private readonly endpoint = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';

  constructor() {
    this.dynamoClient = new DynamoDBClient({
      region: this.region,
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'testing',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'testing',
      },
    });
  }

  /**
   * Delete all items from Users table (cleanup before/after tests)
   */
  async cleanupUsersTable(): Promise<void> {
    try {
      const scanCommand = new ScanCommand({
        TableName: this.tableName,
      });

      const scanResult = await this.dynamoClient.send(scanCommand);
      const items = scanResult.Items || [];

      if (items.length === 0) {
        return;
      }

      // Delete each item
      for (const item of items) {
        if (item.userId?.S) {
          const deleteCommand = new DeleteItemCommand({
            TableName: this.tableName,
            Key: {
              userId: item.userId,
            },
          });
          await this.dynamoClient.send(deleteCommand);
        }
      }
    } catch (error) {
      throw new Error(`Failed to cleanup Users table: ${error}`);
    }
  }

  /**
   * Get user count for verification
   */
  async getUserCount(): Promise<number> {
    try {
      const scanCommand = new ScanCommand({
        TableName: this.tableName,
        Select: 'COUNT',
      });

      const result = await this.dynamoClient.send(scanCommand);
      return result.Count || 0;
    } catch (error) {
      console.error('✗ Error getting user count:', error);
      throw new Error(`Failed to get user count: ${error}`);
    }
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<Record<string, unknown> | null> {
    try {
      const scanCommand = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': { S: email },
        },
      });

      const result = await this.dynamoClient.send(scanCommand);
      if (result.Items && result.Items.length > 0) {
        return this.marshallItem(result.Items[0]);
      }
      return null;
    } catch (error) {
      console.error('✗ Error finding user by email:', error);
      throw new Error(`Failed to find user by email: ${error}`);
    }
  }

  /**
   * Delete specific user by email
   */
  async deleteUserByEmail(email: string): Promise<void> {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) {
        return;
      }

      const deleteCommand = new DeleteItemCommand({
        TableName: this.tableName,
        Key: {
          userId: { S: String(user.userId) },
        },
      });

      await this.dynamoClient.send(deleteCommand);
    } catch (error) {
      throw new Error(`Failed to delete user: ${error}`);
    }
  }

  /**
   * Verify user exists and has expected properties
   */
  async verifyUserExists(email: string): Promise<boolean> {
    const user = await this.findUserByEmail(email);
    return user !== null;
  }

  /**
   * Get all users (for test verification)
   */
  async getAllUsers(): Promise<Record<string, unknown>[]> {
    try {
      const scanCommand = new ScanCommand({
        TableName: this.tableName,
      });

      const result = await this.dynamoClient.send(scanCommand);
      const items = result.Items || [];
      return items.map((item) => this.marshallItem(item));
    } catch (error) {
      console.error('✗ Error getting all users:', error);
      throw new Error(`Failed to get all users: ${error}`);
    }
  }

  /**
   * Close DynamoDB client connection
   */
  async closeConnection(): Promise<void> {
    try {
      await this.dynamoClient.destroy();
    } catch (error) {
      console.warn('Warning closing DynamoDB connection:', error);
    }
  }

  /**
   * Convert DynamoDB item format to plain object
   */
  private marshallItem(item: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(item)) {
      if (typeof value === 'object' && value !== null) {
        const valueObj = value as Record<string, unknown>;
        // Handle different DynamoDB types
        if ('S' in valueObj) {
          result[key] = valueObj.S;
        } else if ('N' in valueObj) {
          result[key] = Number(valueObj.N);
        } else if ('BOOL' in valueObj) {
          result[key] = valueObj.BOOL;
        } else if ('NULL' in valueObj) {
          result[key] = null;
        } else {
          result[key] = value;
        }
      }
    }

    return result;
  }
}

/**
 * Singleton instance for database helper
 */
let databaseHelper: DatabaseHelper | null = null;

export function getDatabaseHelper(): DatabaseHelper {
  if (!databaseHelper) {
    databaseHelper = new DatabaseHelper();
  }
  return databaseHelper;
}
