import { Message } from '@aws-sdk/client-sqs';
import { EmailEventSchema } from '@jobmatch/shared';
import logger from '@jobmatch/shared/logger';
import { EmailService } from '@application/services/email.service';
import { z } from 'zod';

type EmailEvent = z.infer<typeof EmailEventSchema>;

export class EmailMessageHandler {
  constructor(private emailService: EmailService) {}

  async handle(message: Message): Promise<void> {
    if (!message.Body) {
      logger.warn('Empty message body received');
      return;
    }

    try {
      const payload = JSON.parse(message.Body);
      const validatedPayload: EmailEvent = EmailEventSchema.parse(payload);

      await this.processEvent(validatedPayload);

      logger.info(`Email processed successfully for event type: ${validatedPayload.type}`);
    } catch (error) {
      logger.error(`Failed to handle email message: ${error}`);
      throw error;
    }
  }

  private async processEvent(event: EmailEvent): Promise<void> {
    switch (event.type) {
      case 'APPLICATION_CREATED':
        await this.emailService.sendApplicationCreated(event);
        break;
      case 'APPLICATION_ACCEPTED':
        await this.emailService.sendApplicationAccepted(event);
        break;
      case 'APPLICATION_REJECTED':
        await this.emailService.sendApplicationRejected(event);
        break;
      default:
        throw new Error(`Unknown event type: ${(event as any).type}`);
    }
  }
}
