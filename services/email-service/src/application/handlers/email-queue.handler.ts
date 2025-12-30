import { Message } from '@aws-sdk/client-sqs';
import NodemailerClientImpl from '@infrastructure/clients/nodemailer.client';
import SQSClientImpl from '@infrastructure/clients/sqs.client';
import TemplateService from '@domain/services/template.service';
import { EmailPayload } from '@domain/services/email.service.interface';
import logger from '@jobmatch/shared/logger';

export class EmailQueueHandler {
  private nodemailerClient: NodemailerClientImpl;
  private sqsClient: SQSClientImpl;
  private templateService: TemplateService;

  constructor() {
    this.nodemailerClient = new NodemailerClientImpl();
    this.sqsClient = new SQSClientImpl();
    this.templateService = new TemplateService();
  }

  async handleMessage(message: Message): Promise<void> {
    try {
      if (!message.Body) {
        logger.error('Received empty message body');
        return;
      }

      const payload: EmailPayload = JSON.parse(message.Body);
      await this.processEmail(payload);

      // Delete message from queue after successful processing
      if (message.ReceiptHandle) {
        await this.sqsClient.deleteMessage(message.ReceiptHandle);
      }
    } catch (error) {
      logger.error(`Failed to handle message: ${error}`);
      // Message will be retried by SQS
    }
  }

  private async processEmail(payload: EmailPayload): Promise<void> {
    try {
      // Render template with variables
      const htmlContent = await this.templateService.renderTemplate(
        payload.templateName,
        payload.variables
      );

      // Send email
      await this.nodemailerClient.sendMail({
        to: payload.to,
        cc: payload.cc,
        bcc: payload.bcc,
        replyTo: payload.replyTo,
        subject: payload.subject,
        html: htmlContent
      });

      logger.info(`Email sent successfully to ${payload.to}`);
    } catch (error) {
      logger.error(`Failed to process email: ${error}`);
      throw error;
    }
  }

  async startPolling(intervalMs: number = 5000): Promise<void> {
    logger.info('Starting SQS email queue polling');

    setInterval(async () => {
      try {
        const messages = await this.sqsClient.receiveMessages(10, 5);

        for (const message of messages) {
          await this.handleMessage(message);
        }
      } catch (error) {
        logger.error(`Polling error: ${error}`);
      }
    }, intervalMs);
  }
}

export default EmailQueueHandler;
