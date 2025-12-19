import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { EmailEventSchema } from '@jobmatch/shared';
import { ApplicationEventType } from '@domain/entities';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export class SQSService {
  constructor(
    private sqsClient: SQSClient,
    private queueUrl: string
  ) {}

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

  async publishEvent(eventType: ApplicationEventType, payload: unknown): Promise<void> {
    EmailEventSchema.parse(payload);

    await this.retry(() =>
      this.sqsClient.send(
        new SendMessageCommand({
          QueueUrl: this.queueUrl,
          MessageBody: JSON.stringify(payload),
          MessageAttributes: {
            EventType: {
              StringValue: eventType,
              DataType: 'String',
            },
          },
        })
      )
    );
  }
}
