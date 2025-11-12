import { Injectable } from '@nestjs/common';
import { GetCommand, PutCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '../dynamodb/client';
import { User, UserRole } from '@domain/entities/user';
import { UserId } from '@domain/value-objects/user-id';
import { IUserRepository } from '@domain/repositories/user.repository';

@Injectable()
export class DynamoDbUserRepository implements IUserRepository {
  private readonly tableName = 'Users';

  async save(user: User): Promise<void> {
    const primitive = user.toPrimitive();
    await dynamoClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          userId: primitive.userId,
          email: primitive.email,
          password: primitive.password,
          role: primitive.role,
          name: primitive.name,
          companyName: primitive.companyName,
          companyLogoUrl: primitive.companyLogoUrl,
          createdAt: primitive.createdAt,
          updatedAt: primitive.updatedAt,
        },
      })
    );
  }

  async findById(userId: UserId): Promise<User | null> {
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { userId: userId.value },
      })
    );

    if (!result.Item) return null;

    const item = result.Item as Record<string, unknown>;
    return User.restore(
      UserId.from(item.userId as string),
      item.email as string,
      item.password as string,
      item.role as UserRole,
      item.name as string,
      (item.companyName as string) || undefined,
      (item.companyLogoUrl as string) || undefined,
      new Date(item.createdAt as string),
      new Date(item.updatedAt as string)
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email },
      })
    );

    if (!result.Items || result.Items.length === 0) return null;

    const item = result.Items[0] as Record<string, unknown>;
    return User.restore(
      UserId.from(item.userId as string),
      item.email as string,
      item.password as string,
      item.role as UserRole,
      item.name as string,
      (item.companyName as string) || undefined,
      (item.companyLogoUrl as string) || undefined,
      new Date(item.createdAt as string),
      new Date(item.updatedAt as string)
    );
  }

  async findAll(): Promise<User[]> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: this.tableName,
      })
    );

    if (!result.Items) return [];

    return (result.Items as Record<string, unknown>[]).map((item) =>
      User.restore(
        UserId.from(item.userId as string),
        item.email as string,
        item.password as string,
        item.role as UserRole,
        item.name as string,
        (item.companyName as string) || undefined,
        (item.companyLogoUrl as string) || undefined,
        new Date(item.createdAt as string),
        new Date(item.updatedAt as string)
      )
    );
  }

  async delete(userId: UserId): Promise<void> {
    await dynamoClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { userId: userId.value },
      })
    );
  }
}
