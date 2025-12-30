import { EmailService } from '@application/services/email.service';
import { NodemailerClient } from '@infrastructure/clients/nodemailer.client';
import { TemplateService } from '@domain/services/template.service';
import { z } from 'zod';
import { EmailEventSchema } from '@jobmatch/shared';

type EmailEvent = z.infer<typeof EmailEventSchema>;

describe('EmailService', () => {
  let emailService: EmailService;
  let nodemailerClientMock: jest.Mocked<NodemailerClient>;
  let templateServiceMock: jest.Mocked<TemplateService>;
  let emailRepositoryMock: any;
  let emailLogRepositoryMock: any;

  beforeEach(() => {
    nodemailerClientMock = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id-123' }),
      verify: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<NodemailerClient>;

    templateServiceMock = {
      renderTemplate: jest.fn().mockResolvedValue('<html><body>Test Email</body></html>'),
      loadTemplate: jest.fn(),
      clearCache: jest.fn(),
    } as unknown as jest.Mocked<TemplateService>;

    emailRepositoryMock = {
      save: jest.fn().mockResolvedValue(undefined),
    };

    emailLogRepositoryMock = {
      save: jest.fn().mockResolvedValue(undefined),
    };

    emailService = new EmailService(
      nodemailerClientMock,
      templateServiceMock,
      emailRepositoryMock,
      emailLogRepositoryMock
    );
  });

  describe('sendApplicationCreated', () => {
    it('should send application created email to employer', async () => {
      const event: EmailEvent = {
        type: 'APPLICATION_CREATED',
        applicationId: '123',
        employerEmail: 'employer@example.com',
        employerName: 'John Doe',
        jobTitle: 'Senior Developer',
        applicantName: 'Jane Smith',
        applicantEmail: 'jane@example.com',
        coverLetter: 'Great opportunity!',
      };

      await emailService.sendApplicationCreated(event);

      expect(templateServiceMock.renderTemplate).toHaveBeenCalledWith('application-created', {
        employerName: 'John Doe',
        jobTitle: 'Senior Developer',
        applicantName: 'Jane Smith',
        applicantEmail: 'jane@example.com',
        coverLetter: 'Great opportunity!',
      });

      expect(nodemailerClientMock.sendMail).toHaveBeenCalledWith({
        to: 'employer@example.com',
        subject: 'New Application for Senior Developer',
        html: '<html><body>Test Email</body></html>',
      });

      expect(emailRepositoryMock.save).toHaveBeenCalledWith(event);
    });

    it('should throw error for invalid event type', async () => {
      const event: any = {
        type: 'APPLICATION_ACCEPTED',
      };

      await expect(emailService.sendApplicationCreated(event)).rejects.toThrow(
        'Invalid event type for sendApplicationCreated'
      );
    });

    it('should handle template rendering errors', async () => {
      templateServiceMock.renderTemplate.mockRejectedValue(new Error('Template not found'));

      const event: EmailEvent = {
        type: 'APPLICATION_CREATED',
        applicationId: '123',
        employerEmail: 'employer@example.com',
        employerName: 'John Doe',
        jobTitle: 'Senior Developer',
        applicantName: 'Jane Smith',
        applicantEmail: 'jane@example.com',
      };

      await expect(emailService.sendApplicationCreated(event)).rejects.toThrow();
    });

    it('should handle email sending errors with retry', async () => {
      nodemailerClientMock.sendMail.mockRejectedValueOnce(new Error('SMTP error'));
      nodemailerClientMock.sendMail.mockRejectedValueOnce(new Error('SMTP error'));
      nodemailerClientMock.sendMail.mockResolvedValueOnce({ messageId: 'test-id' });

      const event: EmailEvent = {
        type: 'APPLICATION_CREATED',
        applicationId: '123',
        employerEmail: 'employer@example.com',
        employerName: 'John Doe',
        jobTitle: 'Senior Developer',
        applicantName: 'Jane Smith',
        applicantEmail: 'jane@example.com',
      };

      await emailService.sendApplicationCreated(event);

      expect(nodemailerClientMock.sendMail).toHaveBeenCalledTimes(3);
    });
  });

  describe('sendApplicationAccepted', () => {
    it('should send application accepted email to job seeker', async () => {
      const event: EmailEvent = {
        type: 'APPLICATION_ACCEPTED',
        applicationId: '123',
        jobSeekerEmail: 'jane@example.com',
        jobSeekerName: 'Jane Smith',
        jobTitle: 'Senior Developer',
        companyName: 'Tech Corp',
        companyLogoUrl: 'https://example.com/logo.png',
      };

      await emailService.sendApplicationAccepted(event);

      expect(templateServiceMock.renderTemplate).toHaveBeenCalledWith('application-accepted', {
        jobSeekerName: 'Jane Smith',
        jobTitle: 'Senior Developer',
        companyName: 'Tech Corp',
        companyLogoUrl: 'https://example.com/logo.png',
      });

      expect(nodemailerClientMock.sendMail).toHaveBeenCalledWith({
        to: 'jane@example.com',
        subject: 'Congratulations! Your Application for Senior Developer was Accepted!',
        html: '<html><body>Test Email</body></html>',
      });

      expect(emailRepositoryMock.save).toHaveBeenCalledWith(event);
    });

    it('should throw error for invalid event type', async () => {
      const event: any = {
        type: 'APPLICATION_CREATED',
      };

      await expect(emailService.sendApplicationAccepted(event)).rejects.toThrow(
        'Invalid event type for sendApplicationAccepted'
      );
    });
  });

  describe('sendApplicationRejected', () => {
    it('should send application rejected email to job seeker', async () => {
      const event: EmailEvent = {
        type: 'APPLICATION_REJECTED',
        applicationId: '123',
        jobSeekerEmail: 'jane@example.com',
        jobSeekerName: 'Jane Smith',
        jobTitle: 'Senior Developer',
        companyName: 'Tech Corp',
      };

      await emailService.sendApplicationRejected(event);

      expect(templateServiceMock.renderTemplate).toHaveBeenCalledWith('application-rejected', {
        jobSeekerName: 'Jane Smith',
        jobTitle: 'Senior Developer',
        companyName: 'Tech Corp',
      });

      expect(nodemailerClientMock.sendMail).toHaveBeenCalledWith({
        to: 'jane@example.com',
        subject: 'Update on Your Application for Senior Developer',
        html: '<html><body>Test Email</body></html>',
      });

      expect(emailRepositoryMock.save).toHaveBeenCalledWith(event);
    });

    it('should throw error for invalid event type', async () => {
      const event: any = {
        type: 'APPLICATION_CREATED',
      };

      await expect(emailService.sendApplicationRejected(event)).rejects.toThrow(
        'Invalid event type for sendApplicationRejected'
      );
    });
  });

  describe('Error Handling and Retry Logic', () => {
    it('should retry failed email sends', async () => {
      nodemailerClientMock.sendMail
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ messageId: 'success-id' });

      const event: EmailEvent = {
        type: 'APPLICATION_CREATED',
        applicationId: '123',
        employerEmail: 'employer@example.com',
        employerName: 'John Doe',
        jobTitle: 'Senior Developer',
        applicantName: 'Jane Smith',
        applicantEmail: 'jane@example.com',
      };

      await emailService.sendApplicationCreated(event);

      expect(nodemailerClientMock.sendMail).toHaveBeenCalledTimes(3);
    });

    it('should throw error after max retries exceeded', async () => {
      nodemailerClientMock.sendMail.mockRejectedValue(new Error('Persistent network error'));

      const event: EmailEvent = {
        type: 'APPLICATION_CREATED',
        applicationId: '123',
        employerEmail: 'employer@example.com',
        employerName: 'John Doe',
        jobTitle: 'Senior Developer',
        applicantName: 'Jane Smith',
        applicantEmail: 'jane@example.com',
      };

      await expect(emailService.sendApplicationCreated(event)).rejects.toThrow(
        'Email delivery failed'
      );

      // Should attempt multiple times before failing
      expect(nodemailerClientMock.sendMail.mock.calls.length).toBeGreaterThanOrEqual(3);
    }, 15000);
  });

  describe('Email Subject Lines', () => {
    it('should have appropriate subject line for application created', async () => {
      const event: EmailEvent = {
        type: 'APPLICATION_CREATED',
        applicationId: '123',
        employerEmail: 'employer@example.com',
        employerName: 'John Doe',
        jobTitle: 'Senior Developer',
        applicantName: 'Jane Smith',
        applicantEmail: 'jane@example.com',
      };

      await emailService.sendApplicationCreated(event);

      const callArgs = (nodemailerClientMock.sendMail as jest.Mock).mock.calls[0][0];
      expect(callArgs.subject).toBe('New Application for Senior Developer');
    });

    it('should have appropriate subject line for application accepted', async () => {
      const event: EmailEvent = {
        type: 'APPLICATION_ACCEPTED',
        applicationId: '123',
        jobSeekerEmail: 'jane@example.com',
        jobSeekerName: 'Jane Smith',
        jobTitle: 'Senior Developer',
        companyName: 'Tech Corp',
      };

      await emailService.sendApplicationAccepted(event);

      const callArgs = (nodemailerClientMock.sendMail as jest.Mock).mock.calls[0][0];
      expect(callArgs.subject).toContain('Congratulations');
      expect(callArgs.subject).toContain('Senior Developer');
      expect(callArgs.subject).toContain('Accepted');
    });

    it('should have appropriate subject line for application rejected', async () => {
      const event: EmailEvent = {
        type: 'APPLICATION_REJECTED',
        applicationId: '123',
        jobSeekerEmail: 'jane@example.com',
        jobSeekerName: 'Jane Smith',
        jobTitle: 'Senior Developer',
        companyName: 'Tech Corp',
      };

      await emailService.sendApplicationRejected(event);

      const callArgs = (nodemailerClientMock.sendMail as jest.Mock).mock.calls[0][0];
      expect(callArgs.subject).toContain('Update');
      expect(callArgs.subject).toContain('Senior Developer');
    });
  });

  describe('Recipient Routing', () => {
    it('should send application created email to employer', async () => {
      const event: EmailEvent = {
        type: 'APPLICATION_CREATED',
        applicationId: '123',
        employerEmail: 'employer@example.com',
        employerName: 'John Doe',
        jobTitle: 'Senior Developer',
        applicantName: 'Jane Smith',
        applicantEmail: 'jane@example.com',
      };

      await emailService.sendApplicationCreated(event);

      const callArgs = (nodemailerClientMock.sendMail as jest.Mock).mock.calls[0][0];
      expect(callArgs.to).toBe('employer@example.com');
    });

    it('should send application accepted email to job seeker', async () => {
      const event: EmailEvent = {
        type: 'APPLICATION_ACCEPTED',
        applicationId: '123',
        jobSeekerEmail: 'jane@example.com',
        jobSeekerName: 'Jane Smith',
        jobTitle: 'Senior Developer',
        companyName: 'Tech Corp',
      };

      await emailService.sendApplicationAccepted(event);

      const callArgs = (nodemailerClientMock.sendMail as jest.Mock).mock.calls[0][0];
      expect(callArgs.to).toBe('jane@example.com');
    });

    it('should send application rejected email to job seeker', async () => {
      const event: EmailEvent = {
        type: 'APPLICATION_REJECTED',
        applicationId: '123',
        jobSeekerEmail: 'jane@example.com',
        jobSeekerName: 'Jane Smith',
        jobTitle: 'Senior Developer',
        companyName: 'Tech Corp',
      };

      await emailService.sendApplicationRejected(event);

      const callArgs = (nodemailerClientMock.sendMail as jest.Mock).mock.calls[0][0];
      expect(callArgs.to).toBe('jane@example.com');
    });
  });
});
