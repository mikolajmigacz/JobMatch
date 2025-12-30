import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  Message,
} from '@aws-sdk/client-sqs';
import { config } from '@config/bootstrap';
import logger from '@jobmatch/shared/logger';

export interface SQSClientInterface {
  receiveMessages(maxNumberOfMessages?: number, waitTimeSeconds?: number): Promise<Message[]>;
  deleteMessage(receiptHandle: string): Promise<void>;
  isConnected(): Promise<boolean>;
}

export class SQSClientImpl implements SQSClientInterface {
  private client: SQSClient;
  private queueUrl: string;

  constructor() {
    this.client = new SQSClient({
      endpoint: config.SQS_ENDPOINT,
      region: config.AWS_REGION,
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.queueUrl = config.SQS_QUEUE_URL;
  }

  async receiveMessages(
    maxNumberOfMessages: number = 1,
    waitTimeSeconds: number = 5
  ): Promise<Message[]> {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: maxNumberOfMessages,
        WaitTimeSeconds: waitTimeSeconds,
        AttributeNames: ['All'],
        MessageAttributeNames: ['All'],
      });

      const response = await this.client.send(command);
      return response.Messages || [];
    } catch (error) {
      logger.error(`Failed to receive messages from SQS: ${error}`);
      throw error;
    }
  }

  async deleteMessage(receiptHandle: string): Promise<void> {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
      });

      await this.client.send(command);
      logger.info(`Message deleted from SQS: ${receiptHandle}`);
    } catch (error) {
      logger.error(`Failed to delete message from SQS: ${error}`);
      throw error;
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      await this.receiveMessages(0);
      return true;
    } catch (error) {
      logger.error(`SQS connection check failed: ${error}`);
      return false;
    }
  }
}

export default SQSClientImpl;
