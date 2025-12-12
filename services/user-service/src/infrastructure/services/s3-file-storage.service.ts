import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { EnvConfig } from '@config/env.config';

export class S3FileStorageService {
  private s3: S3Client;
  private bucket: string;

  constructor(config: EnvConfig) {
    this.s3 = new S3Client({
      region: config.AWS_REGION,
      endpoint: config.S3_ENDPOINT,
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
    this.bucket = config.S3_BUCKET;
  }

  async uploadFile(key: string, body: Buffer, contentType: string): Promise<string> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    );
    return `s3://${this.bucket}/${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );
  }
}
