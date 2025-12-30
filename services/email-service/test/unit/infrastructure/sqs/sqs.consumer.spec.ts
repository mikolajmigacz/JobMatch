import { SQSConsumer } from '@infrastructure/sqs';
import { SQSClient } from '@aws-sdk/client-sqs';
import { Message } from '@aws-sdk/client-sqs';

jest.mock('@aws-sdk/client-sqs');

describe('SQSConsumer', () => {
  let sqsClient: jest.Mocked<SQSClient>;
  let consumer: SQSConsumer;

  beforeEach(() => {
    sqsClient = new SQSClient() as jest.Mocked<SQSClient>;
    consumer = new SQSConsumer(sqsClient, {
      queueUrl: 'http://localhost:4566/000000000000/test-queue',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateMessage', () => {
    it('should validate correct email event message', async () => {
      const message: Message = {
        Body: JSON.stringify({
          type: 'APPLICATION_CREATED',
          applicationId: '123e4567-e89b-12d3-a456-426614174000',
          employerEmail: 'employer@example.com',
          employerName: 'John Employer',
          jobTitle: 'Senior Developer',
          applicantName: 'Jane Applicant',
          applicantEmail: 'jane@example.com',
        }),
        MessageId: 'msg-123',
      };

      const result = await consumer.validateMessage(message);
      expect(result).toBe(true);
    });

    it('should reject message with empty body', async () => {
      const message: Message = {
        Body: undefined,
        MessageId: 'msg-123',
      };

      const result = await consumer.validateMessage(message);
      expect(result).toBe(false);
    });

    it('should reject message with invalid JSON', async () => {
      const message: Message = {
        Body: 'invalid json',
        MessageId: 'msg-123',
      };

      const result = await consumer.validateMessage(message);
      expect(result).toBe(false);
    });

    it('should reject message missing required fields', async () => {
      const message: Message = {
        Body: JSON.stringify({
          type: 'APPLICATION_CREATED',
        }),
        MessageId: 'msg-123',
      };

      const result = await consumer.validateMessage(message);
      expect(result).toBe(false);
    });
  });
});
