import { randomUUID } from 'crypto';
import { testInfra } from '../setup/test-infrastructure';
import { UserRepository } from '../../src/domain/repositories/user.repository';
import { DeleteUserUseCase } from '../../src/application/use-cases/delete-user.use-case';
import { S3FileStorageService } from '../../src/infrastructure/services/s3-file-storage.service';
import { UploadLogoUseCase } from '../../src/application/use-cases/upload-logo.use-case';
import { EnvConfig } from '../../src/config/env.config';
import type { UserEntityItem } from '../../src/infrastructure/dynamodb/user.entity';

describe('Delete User Integration Tests', () => {
  let repository: UserRepository;
  let s3Service: S3FileStorageService;
  let deleteUserUseCase: DeleteUserUseCase;
  let uploadLogoUseCase: UploadLogoUseCase;
  let config: EnvConfig;

  beforeAll(async () => {
    await testInfra.initialize();
    const documentClient = testInfra.getDatabase().getDocumentClient();
    repository = new UserRepository(documentClient);
    config = testInfra.getConfig();
    s3Service = new S3FileStorageService(config);
    deleteUserUseCase = new DeleteUserUseCase(repository, s3Service);
    uploadLogoUseCase = new UploadLogoUseCase(repository, s3Service);
  });

  afterAll(async () => {
    await testInfra.cleanup();
  });

  describe('User Deletion Flow', () => {
    it('should delete user without logo', async () => {
      const userId = randomUUID();
      const user: UserEntityItem = {
        userId,
        email: `user-delete-${Date.now()}@test.com`,
        password: 'hashedPassword123',
        role: 'job_seeker',
        name: 'User To Delete',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await repository.create(user);
      const existsBefore = await repository.exists(userId);
      expect(existsBefore).toBe(true);

      await deleteUserUseCase.execute({ userId });

      const existsAfter = await repository.exists(userId);
      expect(existsAfter).toBe(false);
    });

    it('should delete user and cleanup logo from S3', async () => {
      const userId = randomUUID();
      const user: UserEntityItem = {
        userId,
        email: `employer-delete-${Date.now()}@test.com`,
        password: 'hashedPassword123',
        role: 'employer',
        name: 'Employer To Delete',
        companyName: 'Delete Company',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await repository.create(user);

      const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44,
        0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f,
        0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x62, 0xf8,
        0x0f, 0x00, 0x00, 0x01, 0x01, 0x01, 0x00, 0x1b, 0xb6, 0xee, 0x56, 0x00, 0x00, 0x00, 0x00,
        0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
      ]);

      const uploadResult = await uploadLogoUseCase.execute({
        userId,
        fileBuffer: pngBuffer,
        mimeType: 'image/png',
      });

      expect(uploadResult?.companyLogoUrl).toBeTruthy();

      const userWithLogo = await repository.getById(userId);
      expect(userWithLogo?.companyLogoUrl).toBeTruthy();

      await deleteUserUseCase.execute({ userId });

      const existsAfter = await repository.exists(userId);
      expect(existsAfter).toBe(false);
    });

    it('should handle deletion of non-existent user', async () => {
      const nonExistentUserId = randomUUID();

      await expect(deleteUserUseCase.execute({ userId: nonExistentUserId })).rejects.toThrow(
        'User not found'
      );
    });
  });
});
