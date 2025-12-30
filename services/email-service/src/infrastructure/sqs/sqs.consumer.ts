import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, Message } from '@aws-sdk/client-sqs';
import { EmailEventSchema } from '@jobmatch/shared';
import logger from '@jobmatch/shared/logger';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export interface SQSConsumerOptions {
  queueUrl: string;
  maxMessages?: number;
  waitTimeSeconds?: number;
  visibilityTimeout?: number;
}

export class SQSConsumer {
  private isRunning = false;
  private pollInterval: NodeJS.Timeout | null = null;

  constructor(
    private sqsClient: SQSClient,
    private options: SQSConsumerOptions
  ) {
    this.options.maxMessages = options.maxMessages || 10;
    this.options.waitTimeSeconds = options.waitTimeSeconds || 5;
    this.options.visibilityTimeout = options.visibilityTimeout || 300;
  }

  private async retry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        return this.retry(fn, retries - 1);
      }
      throw error;
    }
  }

  async receiveMessages(): Promise<Message[]> {
    try {
      const response = await this.sqsClient.send(
        new ReceiveMessageCommand({
          QueueUrl: this.options.queueUrl,
          MaxNumberOfMessages: this.options.maxMessages,
          WaitTimeSeconds: this.options.waitTimeSeconds,
          VisibilityTimeout: this.options.visibilityTimeout,
          AttributeNames: ['All'],
          MessageAttributeNames: ['All'],
        })
      );
      return response.Messages || [];
    } catch (error) {
      logger.error(`Failed to receive messages from SQS: ${error}`);
      throw error;
    }
  }

  async deleteMessage(receiptHandle: string): Promise<void> {
    try {
      await this.retry(() =>
        this.sqsClient.send(
          new DeleteMessageCommand({
            QueueUrl: this.options.queueUrl,
            ReceiptHandle: receiptHandle,
          })
        )
      );
    } catch (error) {
      logger.error(`Failed to delete message from SQS: ${error}`);
      throw error;
    }
  }

  async validateMessage(message: Message): Promise<boolean> {
    if (!message.Body) {
      logger.warn('Received empty message body');
      return false;
    }

    try {
      const payload = JSON.parse(message.Body);
      EmailEventSchema.parse(payload);
      return true;
    } catch (error) {
      logger.error(`Message validation failed: ${error}`);
      return false;
    }
  }

  async start(
    messageHandler: (message: Message) => Promise<void>,
    pollIntervalMs: number = 5000
  ): Promise<void> {
    if (this.isRunning) {
      logger.warn('SQS consumer is already running');
      return;
    }

    this.isRunning = true;
    logger.info('SQS consumer started');

    this.pollInterval = setInterval(async () => {
      try {
        const messages = await this.receiveMessages();

        for (const message of messages) {
          try {
            if (await this.validateMessage(message)) {
              await messageHandler(message);
            } else {
              logger.warn(`Invalid message received, skipping: ${message.MessageId}`);
            }

            if (message.ReceiptHandle) {
              await this.deleteMessage(message.ReceiptHandle);
            }
          } catch (error) {
            logger.error(`Error processing message ${message.MessageId}: ${error}`);
          }
        }
      } catch (error) {
        logger.error(`SQS polling error: ${error}`);
      }
    }, pollIntervalMs);
  }

  async stop(): Promise<void> {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.isRunning = false;
    logger.info('SQS consumer stopped');
  }
}
