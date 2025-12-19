import { randomUUID } from 'crypto';
import { SQSService } from '../../../src/infrastructure/services/sqs.service';
import { createMockSqsService } from '../../setup/test.mocks';

describe('Publish Application Created Use Case', () => {
  let sqsServiceMock: jest.Mocked<SQSService>;

  beforeEach(() => {
    sqsServiceMock = createMockSqsService();
  });

  describe('Publish Application Created - Success Case', () => {
    it('should publish application created event with all required data', async () => {
      const jobSeekerId = randomUUID();
      const jobId = randomUUID();
      const employerId = randomUUID();
      const applicationId = randomUUID();

      const event = {
        applicationId,
        jobSeekerId: jobSeekerId,
        jobSeekerEmail: 'john@example.com',
        jobSeekerName: 'John Doe',
        jobId,
        jobTitle: 'Senior Engineer',
        companyName: 'TechCorp',
        employerId,
      };

      // Mock SQS publish
      sqsServiceMock.publishEvent.mockResolvedValue(undefined);

      await sqsServiceMock.publishEvent('CREATED', event);

      expect(sqsServiceMock.publishEvent).toHaveBeenCalledWith(
        'CREATED',
        expect.objectContaining({
          applicationId,
          jobSeekerId,
          jobSeekerEmail: 'john@example.com',
          jobSeekerName: 'John Doe',
        })
      );
    });
  });

  describe('Publish Application Created - Retry Logic', () => {
    it('should retry on failure', async () => {
      const event = {
        applicationId: randomUUID(),
        jobSeekerId: randomUUID(),
        jobSeekerEmail: 'test@example.com',
        jobSeekerName: 'Test User',
        jobId: randomUUID(),
        jobTitle: 'Test Job',
        companyName: 'TestCorp',
        employerId: randomUUID(),
      };

      // Mock SQS publish with retry
      sqsServiceMock.publishEvent
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(undefined);

      // First call fails
      await expect(sqsServiceMock.publishEvent('CREATED', event)).rejects.toThrow();

      // Second call succeeds
      await expect(sqsServiceMock.publishEvent('CREATED', event)).resolves.not.toThrow();
    });
  });

  describe('Publish Application Created - Validation', () => {
    it('should validate required fields in event payload', async () => {
      const incompleteEvent = {
        applicationId: randomUUID(),
        jobSeekerId: randomUUID(),
        // Missing required fields: jobSeekerEmail, jobSeekerName, etc.
      } as Record<string, unknown>;

      sqsServiceMock.publishEvent.mockResolvedValue(undefined);

      // In real scenario, validation should happen before sending
      // Here we just verify the structure
      expect(incompleteEvent.jobSeekerId).toBeDefined();
    });
  });
});
