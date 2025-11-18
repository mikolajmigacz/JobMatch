import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { UserEntityItem, toPublicUser } from '@infrastructure/dynamodb/user.entity';
import { PublicUser } from '@jobmatch/shared';
import { USERS_TABLE, USERS_EMAIL_INDEX } from '@infrastructure/dynamodb/tables';

export class UserRepository {
  constructor(private documentClient: DynamoDBDocumentClient) {}

  async create(user: UserEntityItem): Promise<PublicUser> {
    await this.documentClient.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: user,
      })
    );
    return toPublicUser(user);
  }

  async getById(userId: string): Promise<PublicUser | null> {
    try {
      const result = await this.documentClient.send(
        new GetCommand({
          TableName: USERS_TABLE,
          Key: { userId },
        })
      );

      if (!result.Item) {
        return null;
      }

      return toPublicUser(result.Item as UserEntityItem);
    } catch (error) {
      if ((error as Record<string, string>).name === 'ResourceNotFoundException') {
        return null;
      }
      throw error;
    }
  }

  async getByEmail(email: string): Promise<PublicUser | null> {
    try {
      const result = await this.documentClient.send(
        new QueryCommand({
          TableName: USERS_TABLE,
          IndexName: USERS_EMAIL_INDEX,
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': email.toLowerCase(),
          },
          Limit: 1,
        })
      );

      if (!result.Items || result.Items.length === 0) {
        return null;
      }

      return toPublicUser(result.Items[0] as UserEntityItem);
    } catch (error) {
      if ((error as Record<string, string>).name === 'ResourceNotFoundException') {
        return null;
      }
      throw error;
    }
  }

  async update(userId: string, updates: Partial<UserEntityItem>): Promise<PublicUser> {
    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, unknown> = {
      ':updatedAt': new Date().toISOString(),
    };
    const expressionAttributeNames: Record<string, string> = {};

    let counter = 0;
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'userId') {
        const placeholder = `#attr${counter}`;
        expressionAttributeNames[placeholder] = key;
        updateExpressions.push(`${placeholder} = :val${counter}`);
        expressionAttributeValues[`:val${counter}`] = value;
        counter++;
      }
    });

    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    updateExpressions.push('#updatedAt = :updatedAt');

    const result = await this.documentClient.send(
      new UpdateCommand({
        TableName: USERS_TABLE,
        Key: { userId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    if (!result.Attributes) {
      throw new Error('Failed to update user');
    }

    return toPublicUser(result.Attributes as UserEntityItem);
  }

  async delete(userId: string): Promise<void> {
    await this.documentClient.send(
      new DeleteCommand({
        TableName: USERS_TABLE,
        Key: { userId },
      })
    );
  }

  async exists(userId: string): Promise<boolean> {
    const user = await this.getById(userId);
    return user !== null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.getByEmail(email);
    return user !== null;
  }

  async getAllWithRole(role: string): Promise<PublicUser[]> {
    try {
      const result = await this.documentClient.send(
        new ScanCommand({
          TableName: USERS_TABLE,
          FilterExpression: '#role = :role',
          ExpressionAttributeNames: {
            '#role': 'role',
          },
          ExpressionAttributeValues: {
            ':role': role,
          },
        })
      );

      if (!result.Items) {
        return [];
      }

      return result.Items.map((item) => toPublicUser(item as UserEntityItem));
    } catch (error) {
      return [];
    }
  }
}
