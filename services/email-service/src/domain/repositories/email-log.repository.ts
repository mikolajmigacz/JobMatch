import { EmailLog } from '@jobmatch/shared';

export interface IEmailLogRepository {
  save(emailLog: EmailLog): Promise<void>;
  findById(emailId: string): Promise<EmailLog | null>;
  findByRecipientEmail(recipientEmail: string, limit?: number): Promise<EmailLog[]>;
  findByRecipientUserId(recipientUserId: string, limit?: number): Promise<EmailLog[]>;
}

export const IEmailLogRepository = Symbol('IEmailLogRepository');
