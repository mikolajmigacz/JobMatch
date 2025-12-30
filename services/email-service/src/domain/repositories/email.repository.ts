import { EmailEventSchema } from '@jobmatch/shared';

export type EmailEvent = typeof EmailEventSchema._output;

export interface IEmailRepository {
  save(event: EmailEvent): Promise<void>;
  findById(emailId: string): Promise<EmailEvent | null>;
  findByRecipient(email: string): Promise<EmailEvent[]>;
}

export const IEmailRepository = Symbol('IEmailRepository');
