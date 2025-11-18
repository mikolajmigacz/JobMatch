import { randomUUID } from 'crypto';
import { testInfra } from '../setup/test-infrastructure';
import { UserRepository } from '../../src/domain/repositories/user.repository';
import { GetProfileUseCase, UpdateProfileUseCase } from '../../src/application/use-cases';
import type { UserEntityItem } from '../../src/infrastructure/dynamodb/user.entity';

describe('User Service Integration Tests - DynamoDB', () => {
  let repository: UserRepository;

  beforeAll(async () => {
    await testInfra.initialize();
    const documentClient = testInfra.getDatabase().getDocumentClient();
    repository = new UserRepository(documentClient);
  });

  afterAll(async () => {
    await testInfra.cleanup();
  });

  describe('UserRepository - DynamoDB Operations', () => {
    it('should create and retrieve a user by ID', async () => {
      const userId = randomUUID();
      const user: UserEntityItem = {
        userId,
        email: 'create-test@example.com',
        password: 'hashedPassword123',
        role: 'job_seeker',
        name: 'John Doe',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Create user
      const created = await repository.create(user);
      expect(created).toMatchObject({
        userId,
        email: 'create-test@example.com',
        name: 'John Doe',
        role: 'job_seeker',
      });

      // Retrieve user
      const retrieved = await repository.getById(userId);
      expect(retrieved).toEqual(created);
    });

    it('should retrieve user by email', async () => {
      const userId = randomUUID();
      const email = `email-test-${Date.now()}@example.com`;
      const user: UserEntityItem = {
        userId,
        email,
        password: 'hashed',
        role: 'employer',
        name: 'Jane Smith',
        companyName: 'Tech Corp',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await repository.create(user);

      const retrieved = await repository.getByEmail(email);
      expect(retrieved).toMatchObject({
        userId,
        email,
        name: 'Jane Smith',
        companyName: 'Tech Corp',
        role: 'employer',
      });
    });

    it('should update user profile', async () => {
      const userId = randomUUID();
      const user: UserEntityItem = {
        userId,
        email: `update-test-${Date.now()}@example.com`,
        password: 'hashed',
        role: 'employer',
        name: 'Original Name',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await repository.create(user);

      // Update user
      const updated = await repository.update(userId, {
        name: 'Updated Name',
        companyName: 'New Company',
      });

      expect(updated).toMatchObject({
        userId,
        name: 'Updated Name',
        companyName: 'New Company',
      });

      // Verify update persisted
      const retrieved = await repository.getById(userId);
      expect(retrieved?.name).toBe('Updated Name');
      expect(retrieved?.companyName).toBe('New Company');
    });

    it('should check if user exists by ID', async () => {
      const userId = randomUUID();
      const user: UserEntityItem = {
        userId,
        email: `exists-test-${Date.now()}@example.com`,
        password: 'hashed',
        role: 'job_seeker',
        name: 'Test User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await repository.create(user);

      const exists = await repository.exists(userId);
      expect(exists).toBe(true);

      const notExists = await repository.exists(randomUUID());
      expect(notExists).toBe(false);
    });

    it('should check if user exists by email', async () => {
      const email = `email-exists-${Date.now()}@example.com`;
      const user: UserEntityItem = {
        userId: randomUUID(),
        email,
        password: 'hashed',
        role: 'employer',
        name: 'Test',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await repository.create(user);

      const exists = await repository.existsByEmail(email);
      expect(exists).toBe(true);

      const notExists = await repository.existsByEmail('nonexistent@example.com');
      expect(notExists).toBe(false);
    });

    it('should delete user', async () => {
      const userId = randomUUID();
      const user: UserEntityItem = {
        userId,
        email: `delete-test-${Date.now()}@example.com`,
        password: 'hashed',
        role: 'job_seeker',
        name: 'To Delete',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await repository.create(user);

      // Verify created
      const exists1 = await repository.exists(userId);
      expect(exists1).toBe(true);

      // Delete
      await repository.delete(userId);

      // Verify deleted
      const exists2 = await repository.exists(userId);
      expect(exists2).toBe(false);
    });
  });

  describe('Use Cases - DynamoDB Integration', () => {
    it('GetProfileUseCase should fetch user profile', async () => {
      const userId = randomUUID();
      const user: UserEntityItem = {
        userId,
        email: `get-profile-${Date.now()}@example.com`,
        password: 'hashed',
        role: 'job_seeker',
        name: 'Profile User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await repository.create(user);
      const getProfileUseCase = new GetProfileUseCase(repository);

      const profile = await getProfileUseCase.execute({ userId });

      expect(profile).toMatchObject({
        userId,
        name: 'Profile User',
        role: 'job_seeker',
      });
    });

    it('UpdateProfileUseCase should update user profile in DynamoDB', async () => {
      const userId = randomUUID();
      const user: UserEntityItem = {
        userId,
        email: `update-profile-${Date.now()}@example.com`,
        password: 'hashed',
        role: 'employer',
        name: 'Before Update',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await repository.create(user);
      const updateProfileUseCase = new UpdateProfileUseCase(repository);

      const updated = await updateProfileUseCase.execute({
        userId,
        name: 'After Update',
        companyName: 'Updated Company',
      });

      expect(updated).toMatchObject({
        name: 'After Update',
        companyName: 'Updated Company',
      });

      // Verify persisted
      const retrieved = await repository.getById(userId);
      expect(retrieved?.name).toBe('After Update');
      expect(retrieved?.companyName).toBe('Updated Company');
    });
  });
});
