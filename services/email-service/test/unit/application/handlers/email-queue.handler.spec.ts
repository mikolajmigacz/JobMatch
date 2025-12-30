import { EmailQueueHandler } from '@application/handlers/email-queue.handler';
import NodemailerClientImpl from '@infrastructure/clients/nodemailer.client';
import SQSClientImpl from '@infrastructure/clients/sqs.client';
import TemplateService from '@domain/services/template.service';
import { Message } from '@aws-sdk/client-sqs';

jest.mock('@infrastructure/clients/nodemailer.client');
jest.mock('@infrastructure/clients/sqs.client');
jest.mock('@domain/services/template.service');

describe('EmailQueueHandler', () => {
  let handler: EmailQueueHandler;
  let mockNodemailer: jest.Mocked<NodemailerClientImpl>;
  let mockSqs: jest.Mocked<SQSClientImpl>;
  let mockTemplate: jest.Mocked<TemplateService>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockNodemailer = new NodemailerClientImpl() as jest.Mocked<NodemailerClientImpl>;
    mockSqs = new SQSClientImpl() as jest.Mocked<SQSClientImpl>;
    mockTemplate = new TemplateService() as jest.Mocked<TemplateService>;

    handler = new EmailQueueHandler();
    (handler as any).nodemailerClient = mockNodemailer;
    (handler as any).sqsClient = mockSqs;
    (handler as any).templateService = mockTemplate;
  });

  describe('handleMessage', () => {
    it('should process valid email message', async () => {
      const message: Message = {
        Body: JSON.stringify({
          to: 'test@example.com',
          templateName: 'job-application',
          subject: 'Test Subject',
          variables: { name: 'John' }
        }),
        ReceiptHandle: 'test-handle'
      };

      mockTemplate.renderTemplate.mockResolvedValue('<html>rendered</html>');
      mockNodemailer.sendMail.mockResolvedValue({ messageId: '123' } as any);

      await handler.handleMessage(message);

      expect(mockTemplate.renderTemplate).toHaveBeenCalledWith('job-application', { name: 'John' });
      expect(mockNodemailer.sendMail).toHaveBeenCalled();
      expect(mockSqs.deleteMessage).toHaveBeenCalledWith('test-handle');
    });

    it('should handle empty message body gracefully', async () => {
      const message: Message = {
        Body: undefined,
        ReceiptHandle: 'test-handle'
      };

      await handler.handleMessage(message);
      expect(mockNodemailer.sendMail).not.toHaveBeenCalled();
    });
  });
});
