import { EmailLogRepository } from '@infrastructure/dynamodb/email-log.repository';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { EmailLog } from '@jobmatch/shared';
import { v4 as uuidv4 } from 'uuid';

jest.mock('@aws-sdk/lib-dynamodb');

describe('EmailLogRepository', () => {
  let repository: EmailLogRepository;
  let mockDocClient: jest.Mocked<DynamoDBDocumentClient>;
  let mockDynamoClient: jest.Mocked<DynamoDBClient>;

  beforeEach(() => {
    mockDynamoClient = {
      send: jest.fn(),
    } as any;

    mockDocClient = {
      send: jest.fn(),
    } as any;

    jest.spyOn(DynamoDBDocumentClient, 'from').mockReturnValue(mockDocClient);

    repository = new EmailLogRepository(mockDynamoClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should save email log to DynamoDB', async () => {
      const emailLog: EmailLog = {
        emailId: uuidv4(),
        recipientEmail: 'test@example.com',
        recipientUserId: uuidv4(),
        subject: 'Test Subject',
        htmlContent: '<p>Test HTML</p>',
        plainTextContent: 'Test text',
        type: 'APPLICATION_CREATED',
        status: 'sent',
        sentAt: new Date().toISOString(),
      };

      mockDocClient.send.mockResolvedValueOnce({});

      await repository.save(emailLog);

      expect(mockDocClient.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });

    it('should save email log without recipientUserId', async () => {
      const emailLog: EmailLog = {
        emailId: uuidv4(),
        recipientEmail: 'test@example.com',
        recipientUserId: undefined,
        subject: 'Test Subject',
        htmlContent: '<p>Test HTML</p>',
        plainTextContent: 'Test text',
        type: 'APPLICATION_CREATED',
        status: 'sent',
        sentAt: new Date().toISOString(),
      };

      mockDocClient.send.mockResolvedValueOnce({});

      await repository.save(emailLog);

      expect(mockDocClient.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });

    it('should throw error if save fails', async () => {
      const emailLog: EmailLog = {
        emailId: uuidv4(),
        recipientEmail: 'test@example.com',
        recipientUserId: uuidv4(),
        subject: 'Test Subject',
        htmlContent: '<p>Test HTML</p>',
        plainTextContent: 'Test text',
        type: 'APPLICATION_CREATED',
        status: 'sent',
        sentAt: new Date().toISOString(),
      };

      mockDocClient.send.mockRejectedValueOnce(new Error('DynamoDB Error'));

      await expect(repository.save(emailLog)).rejects.toThrow('DynamoDB Error');
    });
  });

  describe('findById', () => {
    it('should find email log by ID', async () => {
      const emailId = uuidv4();
      const emailLog: EmailLog = {
        emailId,
        recipientEmail: 'test@example.com',
        recipientUserId: uuidv4(),
        subject: 'Test Subject',
        htmlContent: '<p>Test HTML</p>',
        plainTextContent: 'Test text',
        type: 'APPLICATION_CREATED',
        status: 'sent',
        sentAt: new Date().toISOString(),
      };

      mockDocClient.send.mockResolvedValueOnce({ Item: emailLog });

      const result = await repository.findById(emailId);

      expect(result).toEqual(emailLog);
      expect(mockDocClient.send).toHaveBeenCalledWith(expect.any(GetCommand));
    });

    it('should return null if email log not found', async () => {
      mockDocClient.send.mockResolvedValueOnce({});

      const result = await repository.findById(uuidv4());

      expect(result).toBeNull();
    });

    it('should throw error if query fails', async () => {
      mockDocClient.send.mockRejectedValueOnce(new Error('DynamoDB Error'));

      await expect(repository.findById(uuidv4())).rejects.toThrow('DynamoDB Error');
    });
  });

  describe('findByRecipientEmail', () => {
    it('should find email logs by recipient email', async () => {
      const emailLog1: EmailLog = {
        emailId: uuidv4(),
        recipientEmail: 'test@example.com',
        recipientUserId: uuidv4(),
        subject: 'Test Subject 1',
        htmlContent: '<p>Test HTML</p>',
        plainTextContent: 'Test text',
        type: 'APPLICATION_CREATED',
        status: 'sent',
        sentAt: new Date().toISOString(),
      };

      const emailLog2: EmailLog = {
        emailId: uuidv4(),
        recipientEmail: 'test@example.com',
        recipientUserId: uuidv4(),
        subject: 'Test Subject 2',
        htmlContent: '<p>Test HTML</p>',
        plainTextContent: 'Test text',
        type: 'APPLICATION_ACCEPTED',
        status: 'sent',
        sentAt: new Date().toISOString(),
      };

      mockDocClient.send.mockResolvedValueOnce({ Items: [emailLog1, emailLog2] });

      const result = await repository.findByRecipientEmail('test@example.com');

      expect(result).toHaveLength(2);
      expect(result).toEqual([emailLog1, emailLog2]);
      expect(mockDocClient.send).toHaveBeenCalledWith(expect.any(QueryCommand));
    });

    it('should return empty array if no email logs found', async () => {
      mockDocClient.send.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findByRecipientEmail('test@example.com');

      expect(result).toEqual([]);
    });

    it('should respect limit parameter', async () => {
      mockDocClient.send.mockResolvedValueOnce({ Items: [] });

      await repository.findByRecipientEmail('test@example.com', 10);

      expect(mockDocClient.send).toHaveBeenCalledTimes(1);
      const sendCall = mockDocClient.send.mock.calls[0][0];
      expect(sendCall).toBeInstanceOf(QueryCommand);
    });

    it('should throw error if query fails', async () => {
      mockDocClient.send.mockRejectedValueOnce(new Error('DynamoDB Error'));

      await expect(repository.findByRecipientEmail('test@example.com')).rejects.toThrow(
        'DynamoDB Error'
      );
    });
  });

  describe('findByRecipientUserId', () => {
    it('should find email logs by recipient user ID', async () => {
      const userId = uuidv4();
      const emailLog1: EmailLog = {
        emailId: uuidv4(),
        recipientEmail: 'test@example.com',
        recipientUserId: userId,
        subject: 'Test Subject 1',
        htmlContent: '<p>Test HTML</p>',
        plainTextContent: 'Test text',
        type: 'APPLICATION_CREATED',
        status: 'sent',
        sentAt: new Date().toISOString(),
      };

      const emailLog2: EmailLog = {
        emailId: uuidv4(),
        recipientEmail: 'test2@example.com',
        recipientUserId: userId,
        subject: 'Test Subject 2',
        htmlContent: '<p>Test HTML</p>',
        plainTextContent: 'Test text',
        type: 'APPLICATION_ACCEPTED',
        status: 'sent',
        sentAt: new Date().toISOString(),
      };

      mockDocClient.send.mockResolvedValueOnce({ Items: [emailLog1, emailLog2] });

      const result = await repository.findByRecipientUserId(userId);

      expect(result).toHaveLength(2);
      expect(result).toEqual([emailLog1, emailLog2]);
      expect(mockDocClient.send).toHaveBeenCalledWith(expect.any(QueryCommand));
    });

    it('should return empty array if no email logs found', async () => {
      mockDocClient.send.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findByRecipientUserId(uuidv4());

      expect(result).toEqual([]);
    });

    it('should handle email logs with undefined recipientUserId', async () => {
      const userId = uuidv4();
      const emailLogWithId: EmailLog = {
        emailId: uuidv4(),
        recipientEmail: 'test@example.com',
        recipientUserId: userId,
        subject: 'Test Subject',
        htmlContent: '<p>Test HTML</p>',
        plainTextContent: 'Test text',
        type: 'APPLICATION_CREATED',
        status: 'sent',
        sentAt: new Date().toISOString(),
      };

      const emailLogWithoutId: EmailLog = {
        emailId: uuidv4(),
        recipientEmail: 'test2@example.com',
        recipientUserId: undefined,
        subject: 'Test Subject 2',
        htmlContent: '<p>Test HTML</p>',
        plainTextContent: 'Test text',
        type: 'APPLICATION_CREATED',
        status: 'sent',
        sentAt: new Date().toISOString(),
      };

      mockDocClient.send.mockResolvedValueOnce({ Items: [emailLogWithId, emailLogWithoutId] });

      const result = await repository.findByRecipientUserId(userId);

      expect(result).toHaveLength(2);
    });

    it('should respect limit parameter', async () => {
      mockDocClient.send.mockResolvedValueOnce({ Items: [] });

      await repository.findByRecipientUserId(uuidv4(), 20);

      expect(mockDocClient.send).toHaveBeenCalledTimes(1);
      const sendCall = mockDocClient.send.mock.calls[0][0];
      expect(sendCall).toBeInstanceOf(QueryCommand);
    });

    it('should throw error if query fails', async () => {
      mockDocClient.send.mockRejectedValueOnce(new Error('DynamoDB Error'));

      await expect(repository.findByRecipientUserId(uuidv4())).rejects.toThrow('DynamoDB Error');
    });
  });
});
