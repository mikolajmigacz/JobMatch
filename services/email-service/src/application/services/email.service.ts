import { NodemailerClient } from '@infrastructure/clients/nodemailer.client';
import { TemplateService } from '@domain/services/template.service';
import { IEmailRepository, IEmailLogRepository } from '@domain/repositories';
import logger from '@jobmatch/shared/logger';
import { EmailLog, EmailLogSchema } from '@jobmatch/shared';
import { z } from 'zod';
import { EmailEventSchema } from '@jobmatch/shared';
import { v4 as uuidv4 } from 'uuid';

type EmailEvent = z.infer<typeof EmailEventSchema>;

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface IEmailService {
  sendApplicationCreated(event: EmailEvent): Promise<void>;
  sendApplicationAccepted(event: EmailEvent): Promise<void>;
  sendApplicationRejected(event: EmailEvent): Promise<void>;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export class EmailService implements IEmailService {
  constructor(
    private nodemailerClient: NodemailerClient,
    private templateService: TemplateService,
    private emailRepository: IEmailRepository,
    private emailLogRepository: IEmailLogRepository
  ) {}

  private async retry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        logger.warn(`Retry attempt, remaining retries: ${retries}`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        return this.retry(fn, retries - 1);
      }
      throw error;
    }
  }

  private async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      await this.retry(async () => {
        const result = await this.nodemailerClient.sendMail({
          to: options.to,
          subject: options.subject,
          html: options.html,
        });
        logger.info(`Email sent successfully: ${result.messageId}`);
      });
    } catch (error) {
      logger.error(`Failed to send email after retries: ${error}`);
      throw new Error(`Email delivery failed: ${error}`);
    }
  }

  private async logEmail(
    recipientEmail: string,
    subject: string,
    htmlContent: string,
    plainTextContent: string,
    eventType: 'APPLICATION_CREATED' | 'APPLICATION_ACCEPTED' | 'APPLICATION_REJECTED',
    status: 'sent' | 'failed',
    failureReason?: string
  ): Promise<void> {
    try {
      const emailLog: EmailLog = EmailLogSchema.parse({
        emailId: uuidv4(),
        recipientEmail,
        recipientUserId: undefined,
        subject,
        htmlContent,
        plainTextContent,
        type: eventType,
        status,
        sentAt: new Date().toISOString(),
        failureReason,
      });

      await this.emailLogRepository.save(emailLog);
      logger.info(`Email log saved: ${emailLog.emailId}`);
    } catch (error) {
      logger.error(`Failed to log email: ${error}`);
    }
  }

  async sendApplicationCreated(event: EmailEvent): Promise<void> {
    if (event.type !== 'APPLICATION_CREATED') {
      throw new Error('Invalid event type for sendApplicationCreated');
    }

    try {
      const html = await this.templateService.renderTemplate('application-created', {
        employerName: event.employerName,
        jobTitle: event.jobTitle,
        applicantName: event.applicantName,
        applicantEmail: event.applicantEmail,
        coverLetter: event.coverLetter,
      });

      const plainText = `New Application for ${event.jobTitle}\n\nCandidate: ${event.applicantName} (${event.applicantEmail})`;

      await this.sendEmail({
        to: event.employerEmail,
        subject: `New Application for ${event.jobTitle}`,
        html,
      });

      await this.logEmail(
        event.employerEmail,
        `New Application for ${event.jobTitle}`,
        html,
        plainText,
        'APPLICATION_CREATED',
        'sent'
      );

      await this.emailRepository.save(event);
      logger.info(`Application created email sent to: ${event.employerEmail}`);
    } catch (error) {
      logger.error(`Failed to send application created email: ${error}`);
      throw error;
    }
  }

  async sendApplicationAccepted(event: EmailEvent): Promise<void> {
    if (event.type !== 'APPLICATION_ACCEPTED') {
      throw new Error('Invalid event type for sendApplicationAccepted');
    }

    try {
      const html = await this.templateService.renderTemplate('application-accepted', {
        jobSeekerName: event.jobSeekerName,
        jobTitle: event.jobTitle,
        companyName: event.companyName,
        companyLogoUrl: event.companyLogoUrl,
      });

      const plainText = `Congratulations! Your application for ${event.jobTitle} at ${event.companyName} has been accepted!`;

      await this.sendEmail({
        to: event.jobSeekerEmail,
        subject: `Congratulations! Your Application for ${event.jobTitle} was Accepted!`,
        html,
      });

      await this.logEmail(
        event.jobSeekerEmail,
        `Congratulations! Your Application for ${event.jobTitle} was Accepted!`,
        html,
        plainText,
        'APPLICATION_ACCEPTED',
        'sent'
      );

      await this.emailRepository.save(event);
      logger.info(`Application accepted email sent to: ${event.jobSeekerEmail}`);
    } catch (error) {
      logger.error(`Failed to send application accepted email: ${error}`);
      throw error;
    }
  }

  async sendApplicationRejected(event: EmailEvent): Promise<void> {
    if (event.type !== 'APPLICATION_REJECTED') {
      throw new Error('Invalid event type for sendApplicationRejected');
    }

    try {
      const html = await this.templateService.renderTemplate('application-rejected', {
        jobSeekerName: event.jobSeekerName,
        jobTitle: event.jobTitle,
        companyName: event.companyName,
      });

      const plainText = `We regret to inform you that your application for ${event.jobTitle} at ${event.companyName} was not successful.`;

      await this.sendEmail({
        to: event.jobSeekerEmail,
        subject: `Update on Your Application for ${event.jobTitle}`,
        html,
      });

      await this.logEmail(
        event.jobSeekerEmail,
        `Update on Your Application for ${event.jobTitle}`,
        html,
        plainText,
        'APPLICATION_REJECTED',
        'sent'
      );

      await this.emailRepository.save(event);
      logger.info(`Application rejected email sent to: ${event.jobSeekerEmail}`);
    } catch (error) {
      logger.error(`Failed to send application rejected email: ${error}`);
      throw error;
    }
  }
}

export default EmailService;
