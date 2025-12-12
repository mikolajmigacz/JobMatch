import { randomUUID } from 'crypto';
import { testInfra } from '../setup/test-infrastructure';
import { UserRepository } from '../../src/domain/repositories/user.repository';
import { UploadLogoUseCase } from '../../src/application/use-cases/upload-logo.use-case';
import { S3FileStorageService } from '../../src/infrastructure/services/s3-file-storage.service';
import { EnvConfig } from '../../src/config/env.config';
import type { UserEntityItem } from '../../src/infrastructure/dynamodb/user.entity';

describe('Upload Logo Integration Tests', () => {
  let repository: UserRepository;
  let s3Service: S3FileStorageService;
  let uploadLogoUseCase: UploadLogoUseCase;
  let config: EnvConfig;

  beforeAll(async () => {
    await testInfra.initialize();
    const documentClient = testInfra.getDatabase().getDocumentClient();
    repository = new UserRepository(documentClient);
    config = testInfra.getConfig();
    s3Service = new S3FileStorageService(config);
    uploadLogoUseCase = new UploadLogoUseCase(repository, s3Service);
  });

  afterAll(async () => {
    await testInfra.cleanup();
  });

  describe('Logo Upload Flow', () => {
    it('should upload logo and update user profile', async () => {
      const userId = randomUUID();
      const user: UserEntityItem = {
        userId,
        email: `employer-${Date.now()}@test.com`,
        password: 'hashedPassword123',
        role: 'employer',
        name: 'Test Employer',
        companyName: 'Test Company',
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

      const result = await uploadLogoUseCase.execute({
        userId,
        fileBuffer: pngBuffer,
        mimeType: 'image/png',
      });

      expect(result).toBeDefined();
      expect(result?.companyLogoUrl).toBeTruthy();
      expect(result?.companyLogoUrl).toContain('s3://');
      expect(result?.companyLogoUrl).toContain('logos');

      const updatedUser = await repository.getById(userId);
      expect(updatedUser?.companyLogoUrl).toBe(result?.companyLogoUrl);
    });

    it('should replace old logo when uploading new one', async () => {
      const userId = randomUUID();
      const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44,
        0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f,
        0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x62, 0xf8,
        0x0f, 0x00, 0x00, 0x01, 0x01, 0x01, 0x00, 0x1b, 0xb6, 0xee, 0x56, 0x00, 0x00, 0x00, 0x00,
        0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
      ]);

      const user: UserEntityItem = {
        userId,
        email: `employer-replace-${Date.now()}@test.com`,
        password: 'hashedPassword123',
        role: 'employer',
        name: 'Employer With Logo',
        companyName: 'Company Inc',
        companyLogoUrl: 's3://bucket/old-logo.png',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await repository.create(user);

      // Upload first logo
      const firstUpload = await uploadLogoUseCase.execute({
        userId,
        fileBuffer: pngBuffer,
        mimeType: 'image/png',
      });

      expect(firstUpload?.companyLogoUrl).toBeTruthy();

      const secondUpload = await uploadLogoUseCase.execute({
        userId,
        fileBuffer: pngBuffer,
        mimeType: 'image/png',
      });

      expect(secondUpload?.companyLogoUrl).toBeTruthy();
      expect(secondUpload?.companyLogoUrl).not.toBe(firstUpload?.companyLogoUrl);

      const updatedUser = await repository.getById(userId);
      expect(updatedUser?.companyLogoUrl).toBe(secondUpload?.companyLogoUrl);
    });

    it('should handle different image formats (JPEG)', async () => {
      const userId = randomUUID();
      const user: UserEntityItem = {
        userId,
        email: `employer-jpeg-${Date.now()}@test.com`,
        password: 'hashedPassword123',
        role: 'employer',
        name: 'JPEG Employer',
        companyName: 'JPEG Company',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await repository.create(user);

      const jpegBuffer = Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00,
        0x01, 0x00, 0x01, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06,
        0x05, 0x08,
      ]);

      const result = await uploadLogoUseCase.execute({
        userId,
        fileBuffer: jpegBuffer,
        mimeType: 'image/jpeg',
      });

      expect(result).toBeDefined();
      expect(result?.companyLogoUrl).toBeTruthy();
      expect(result?.companyLogoUrl).toContain('.jpg');

      const updatedUser = await repository.getById(userId);
      expect(updatedUser?.companyLogoUrl).toMatch(/\.jpg$/);
    });
  });
});
