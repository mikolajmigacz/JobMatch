import { randomUUID } from 'crypto';
import { UserRepository } from '@domain/repositories/user.repository';
import { UserEntityItem } from '@infrastructure/dynamodb/user.entity';

describe('UserRepository', () => {
  let repository: UserRepository;
  const mockDocumentClient = {
    send: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repository = new UserRepository(mockDocumentClient as any);
  });

  describe('create', () => {
    it('should create a user and return public user', async () => {
      const user: UserEntityItem = {
        userId: randomUUID(),
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'job_seeker',
        name: 'Test User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockDocumentClient.send.mockResolvedValueOnce({});

      const result = await repository.create(user);

      expect(result).toEqual({
        userId: user.userId,
        email: user.email,
        role: user.role,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
      expect(mockDocumentClient.send).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return null when user does not exist', async () => {
      mockDocumentClient.send.mockResolvedValueOnce({ Item: undefined });

      const result = await repository.getById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('getByEmail', () => {
    it('should return null when user with email does not exist', async () => {
      mockDocumentClient.send.mockResolvedValueOnce({ Items: [] });

      const result = await repository.getByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('exists', () => {
    it('should return true when user exists', async () => {
      const user: UserEntityItem = {
        userId: randomUUID(),
        email: 'test@example.com',
        password: 'hashed',
        role: 'employer',
        name: 'Test',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockDocumentClient.send.mockResolvedValueOnce({ Item: user });

      const result = await repository.exists(user.userId);

      expect(result).toBe(true);
    });

    it('should return false when user does not exist', async () => {
      mockDocumentClient.send.mockResolvedValueOnce({ Item: undefined });

      const result = await repository.exists('nonexistent');

      expect(result).toBe(false);
    });
  });

  describe('existsByEmail', () => {
    it('should return true when user with email exists', async () => {
      const user: UserEntityItem = {
        userId: randomUUID(),
        email: 'test@example.com',
        password: 'hashed',
        role: 'employer',
        name: 'Test',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockDocumentClient.send.mockResolvedValueOnce({ Items: [user] });

      const result = await repository.existsByEmail(user.email);

      expect(result).toBe(true);
    });

    it('should return false when user with email does not exist', async () => {
      mockDocumentClient.send.mockResolvedValueOnce({ Items: [] });

      const result = await repository.existsByEmail('nonexistent@example.com');

      expect(result).toBe(false);
    });
  });
});
