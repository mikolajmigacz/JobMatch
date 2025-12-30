import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { EmailLog } from '@jobmatch/shared';
import { IEmailLogRepository } from '@domain/repositories';
import logger from '@jobmatch/shared/logger';
import {
  EMAIL_LOGS_TABLE,
  EMAIL_LOGS_RECIPIENT_EMAIL_INDEX,
  EMAIL_LOGS_RECIPIENT_USER_ID_INDEX,
} from './tables';
import { EmailLogEntityItem, toEmailLog } from './email-log.entity';

export class EmailLogRepository implements IEmailLogRepository {
  private docClient: DynamoDBDocumentClient;

  constructor(dynamoClient: DynamoDBClient) {
    this.docClient = DynamoDBDocumentClient.from(dynamoClient, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });
  }

  async save(emailLog: EmailLog): Promise<void> {
    try {
      const item: EmailLogEntityItem = {
        emailId: emailLog.emailId,
        recipientEmail: emailLog.recipientEmail,
        recipientUserId: emailLog.recipientUserId,
        subject: emailLog.subject,
        htmlContent: emailLog.htmlContent,
        plainTextContent: emailLog.plainTextContent,
        type: emailLog.type,
        status: emailLog.status,
        sentAt: emailLog.sentAt,
        failureReason: emailLog.failureReason,
      };

      await this.docClient.send(
        new PutCommand({
          TableName: EMAIL_LOGS_TABLE,
          Item: item,
        })
      );

      logger.info(`Email log saved: ${emailLog.emailId}`);
    } catch (error) {
      logger.error(`Failed to save email log: ${error}`);
      throw error;
    }
  }

  async findById(emailId: string): Promise<EmailLog | null> {
    try {
      const result = await this.docClient.send(
        new GetCommand({
          TableName: EMAIL_LOGS_TABLE,
          Key: { emailId },
        })
      );

      if (!result.Item) {
        return null;
      }

      return toEmailLog(result.Item as EmailLogEntityItem);
    } catch (error) {
      logger.error(`Failed to find email log by ID: ${error}`);
      throw error;
    }
  }

  async findByRecipientEmail(recipientEmail: string, limit = 50): Promise<EmailLog[]> {
    try {
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: EMAIL_LOGS_TABLE,
          IndexName: EMAIL_LOGS_RECIPIENT_EMAIL_INDEX,
          KeyConditionExpression: 'recipientEmail = :email',
          ExpressionAttributeValues: {
            ':email': recipientEmail,
          },
          Limit: limit,
          ScanIndexForward: false,
        })
      );

      return (result.Items || []).map((item) => toEmailLog(item as EmailLogEntityItem));
    } catch (error) {
      logger.error(`Failed to find email logs by recipient email: ${error}`);
      throw error;
    }
  }

  async findByRecipientUserId(recipientUserId: string, limit = 50): Promise<EmailLog[]> {
    try {
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: EMAIL_LOGS_TABLE,
          IndexName: EMAIL_LOGS_RECIPIENT_USER_ID_INDEX,
          KeyConditionExpression: 'recipientUserId = :userId',
          ExpressionAttributeValues: {
            ':userId': recipientUserId,
          },
          Limit: limit,
          ScanIndexForward: false,
        })
      );

      return (result.Items || []).map((item) => toEmailLog(item as EmailLogEntityItem));
    } catch (error) {
      logger.error(`Failed to find email logs by recipient user ID: ${error}`);
      throw error;
    }
  }
}
