export interface EmailTemplate {
  templateName: string;
  subject: string;
  variables: Record<string, any>;
}

export interface EmailPayload {
  to: string;
  templateName: string;
  subject: string;
  variables: Record<string, any>;
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailService {
  sendEmail(payload: EmailPayload): Promise<SendEmailResult>;
  sendBulkEmails(payloads: EmailPayload[]): Promise<SendEmailResult[]>;
}
