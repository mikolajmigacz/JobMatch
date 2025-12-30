import { S3Service } from '@infrastructure/clients/s3.client';
import { testInfra } from './setup/test-infrastructure';

describe('S3Service Integration Tests', () => {
  let s3Service: S3Service;
  let config: any;

  beforeAll(async () => {
    await testInfra.initialize();
    config = testInfra.getConfig();
    s3Service = new S3Service(config);
  }, 60000);

  afterAll(async () => {
    await testInfra.cleanup();
  }, 30000);

  const testKey = `test-cv-${Date.now()}.pdf`;
  const testContent = Buffer.from('Test CV content');

  it('should upload CV', async () => {
    const result = await s3Service.uploadCV(testKey, testContent, 'application/pdf');
    expect(result).toBe(`s3://${config.S3_BUCKET}/${testKey}`);
  });

  it('should download CV', async () => {
    const buffer = await s3Service.downloadCV(testKey);
    expect(buffer.toString()).toBe('Test CV content');
  });

  it('should generate presigned URL', async () => {
    const url = await s3Service.generatePresignedUrl(testKey, 3600);
    expect(url).toContain(testKey);
    expect(url).toContain('X-Amz-Signature');
  });

  it('should delete CV', async () => {
    await expect(s3Service.deleteCV(testKey)).resolves.not.toThrow();
  });

  it('should throw error on download non-existent file', async () => {
    await expect(s3Service.downloadCV('non-existent-key')).rejects.toThrow();
  });
});
