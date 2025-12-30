import { EmailLog, EmailType, EmailStatus } from '@jobmatch/shared';

export interface EmailLogEntityItem {
  emailId: string;
  recipientEmail: string;
  recipientUserId?: string | null;
  subject: string;
  htmlContent: string;
  plainTextContent: string;
  type: EmailType;
  status: EmailStatus;
  sentAt: string;
  failureReason?: string | null;
}

export function toEmailLog(item: EmailLogEntityItem): EmailLog {
  return {
    emailId: item.emailId,
    recipientEmail: item.recipientEmail,
    recipientUserId: item.recipientUserId,
    subject: item.subject,
    htmlContent: item.htmlContent,
    plainTextContent: item.plainTextContent,
    type: item.type,
    status: item.status,
    sentAt: item.sentAt,
    failureReason: item.failureReason,
  };
}
