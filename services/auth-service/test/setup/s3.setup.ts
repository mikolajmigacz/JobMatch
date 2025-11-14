import { S3Client, CreateBucketCommand, ListBucketsCommand } from '@aws-sdk/client-s3';

export class TestS3Setup {
  private readonly s3: S3Client;
  private readonly bucketName: string;

  constructor(bucketName: string = 'test-jobmatch-bucket') {
    this.bucketName = bucketName;
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.S3_ENDPOINT || 'http://localhost:4566',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
      },
      forcePathStyle: true,
    });
  }

  /**
   * Create S3 bucket if it doesn't exist
   */
  async createBucket(): Promise<void> {
    try {
      const buckets = await this.s3.send(new ListBucketsCommand({}));
      const exists = buckets.Buckets?.some((b) => b.Name === this.bucketName);

      if (!exists) {
        await this.s3.send(
          new CreateBucketCommand({
            Bucket: this.bucketName,
          })
        );
      }
    } catch (error) {
      throw new Error(
        `Failed to create S3 test bucket: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get configured bucket name
   */
  getBucketName(): string {
    return this.bucketName;
  }

  /**
   * Cleanup S3 resources after tests
   * Note: LocalStack automatically clears on restart
   */
  async cleanup(): Promise<void> {
    try {
      this.s3.destroy();
    } catch (error) {
      console.warn('S3 cleanup error:', error);
    }
  }
}
