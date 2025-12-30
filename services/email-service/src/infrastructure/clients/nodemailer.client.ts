import nodemailer from 'nodemailer';
import { config } from '@config/bootstrap';
import logger from '@jobmatch/shared/logger';

export interface INodemailerClient {
  sendMail(options: nodemailer.SendMailOptions): Promise<nodemailer.SentMessageInfo>;
  verify(): Promise<boolean>;
}

export class NodemailerClient implements INodemailerClient {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_SECURE,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASSWORD,
      },
    });
  }

  async sendMail(options: nodemailer.SendMailOptions): Promise<nodemailer.SentMessageInfo> {
    try {
      const mailOptions = {
        from: config.SMTP_FROM,
        ...options,
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully: ${result.messageId}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send email: ${error}`);
      throw error;
    }
  }

  async verify(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('SMTP connection verified successfully');
      return true;
    } catch (error) {
      logger.error(`SMTP verification failed: ${error}`);
      return false;
    }
  }
}

export default NodemailerClient;
