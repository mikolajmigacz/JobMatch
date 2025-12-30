import { EmailMessageHandler } from '@application/handlers/email-message.handler';
import { EmailService } from '@application/services/email.service';
import { Message } from '@aws-sdk/client-sqs';

describe('EmailMessageHandler', () => {
  let handler: EmailMessageHandler;
  let mockEmailService: jest.Mocked<EmailService>;

  beforeEach(() => {
    mockEmailService = {
      sendApplicationCreated: jest.fn(),
      sendApplicationAccepted: jest.fn(),
      sendApplicationRejected: jest.fn(),
    } as any;

    handler = new EmailMessageHandler(mockEmailService);
  });

  describe('handle', () => {
    it('should process APPLICATION_CREATED event', async () => {
      const message: Message = {
        Body: JSON.stringify({
          type: 'APPLICATION_CREATED',
          applicationId: '123e4567-e89b-12d3-a456-426614174000',
          employerEmail: 'employer@example.com',
          employerName: 'Employer Name',
          jobTitle: 'Developer',
          applicantName: 'Applicant Name',
          applicantEmail: 'applicant@example.com',
        }),
        MessageId: 'msg-123',
      };

      mockEmailService.sendApplicationCreated.mockResolvedValue(undefined);

      await handler.handle(message);

      expect(mockEmailService.sendApplicationCreated).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'APPLICATION_CREATED',
          employerName: 'Employer Name',
          jobTitle: 'Developer',
        })
      );
    });

    it('should process APPLICATION_ACCEPTED event', async () => {
      const message: Message = {
        Body: JSON.stringify({
          type: 'APPLICATION_ACCEPTED',
          applicationId: '123e4567-e89b-12d3-a456-426614174000',
          jobSeekerEmail: 'jobseeker@example.com',
          jobSeekerName: 'Job Seeker',
          jobTitle: 'Developer',
          companyName: 'Company Name',
        }),
        MessageId: 'msg-123',
      };

      mockEmailService.sendApplicationAccepted.mockResolvedValue(undefined);

      await handler.handle(message);

      expect(mockEmailService.sendApplicationAccepted).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'APPLICATION_ACCEPTED',
          jobSeekerName: 'Job Seeker',
        })
      );
    });

    it('should process APPLICATION_REJECTED event', async () => {
      const message: Message = {
        Body: JSON.stringify({
          type: 'APPLICATION_REJECTED',
          applicationId: '123e4567-e89b-12d3-a456-426614174000',
          jobSeekerEmail: 'jobseeker@example.com',
          jobSeekerName: 'Job Seeker',
          jobTitle: 'Developer',
          companyName: 'Company Name',
        }),
        MessageId: 'msg-123',
      };

      mockEmailService.sendApplicationRejected.mockResolvedValue(undefined);

      await handler.handle(message);

      expect(mockEmailService.sendApplicationRejected).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'APPLICATION_REJECTED',
          jobSeekerName: 'Job Seeker',
        })
      );
    });

    it('should handle empty message body', async () => {
      const message: Message = {
        Body: undefined,
        MessageId: 'msg-123',
      };

      await handler.handle(message);

      expect(mockEmailService.sendApplicationCreated).not.toHaveBeenCalled();
      expect(mockEmailService.sendApplicationAccepted).not.toHaveBeenCalled();
      expect(mockEmailService.sendApplicationRejected).not.toHaveBeenCalled();
    });

    it('should throw error on invalid event type', async () => {
      const message: Message = {
        Body: JSON.stringify({
          type: 'INVALID_TYPE',
          applicationId: '123e4567-e89b-12d3-a456-426614174000',
        }),
        MessageId: 'msg-123',
      };

      await expect(handler.handle(message)).rejects.toThrow();
    });

    it('should throw error on malformed message body', async () => {
      const message: Message = {
        Body: 'invalid json',
        MessageId: 'msg-123',
      };

      await expect(handler.handle(message)).rejects.toThrow();
    });
  });
});
