import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { EmailEventSchema } from '@jobmatch/shared';
import { IEmailRepository } from '@domain/repositories';
import logger from '@jobmatch/shared/logger';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

type EmailEvent = z.infer<typeof EmailEventSchema>;

export class EmailRepository implements IEmailRepository {
  private docClient: DynamoDBDocumentClient;

  constructor(
    dynamoClient: DynamoDBClient,
    private tableName: string
  ) {
    this.docClient = DynamoDBDocumentClient.from(dynamoClient);
  }

  async save(event: EmailEvent): Promise<void> {
    try {
      const emailId = uuidv4();
      const recipientEmail = this.getRecipientEmail(event);

      const item = {
        emailId,
        recipientEmail,
        eventType: event.type,
        applicationId: (event as any).applicationId,
        eventData: event,
        createdAt: new Date().toISOString(),
        sentAt: new Date().toISOString(),
      };

      await this.docClient.send(
        new PutCommand({
          TableName: this.tableName,
          Item: item,
        })
      );

      logger.info(`Email record saved: ${emailId}`);
    } catch (error) {
      logger.error(`Failed to save email record: ${error}`);
      throw error;
    }
  }

  async findById(emailId: string): Promise<(typeof EmailEventSchema._output) | null> {
    try {
      const result = await this.docClient.send(
        new GetCommand({
          TableName: this.tableName,
          Key: { emailId },
        })
      );

      return (result.Item?.eventData as typeof EmailEventSchema._output) || null;
    } catch (error) {
      logger.error(`Failed to find email by ID: ${error}`);
      throw error;
    }
  }

  async findByRecipient(email: string): Promise<(typeof EmailEventSchema._output)[]> {
    try {
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: this.tableName,
          IndexName: 'recipientEmailIndex',
          KeyConditionExpression: 'recipientEmail = :email',
          ExpressionAttributeValues: {
            ':email': email,
          },
        })
      );

      return (result.Items || []).map((item) => item.eventData);
    } catch (error) {
      logger.error(`Failed to find emails by recipient: ${error}`);
      throw error;
    }
  }

  private getRecipientEmail(event: typeof EmailEventSchema._output): string {
    switch (event.type) {
      case 'APPLICATION_CREATED':
        return event.employerEmail;
      case 'APPLICATION_ACCEPTED':
        return event.jobSeekerEmail;
      case 'APPLICATION_REJECTED':
        return event.jobSeekerEmail;
      default:
        return '';
    }
  }
}
