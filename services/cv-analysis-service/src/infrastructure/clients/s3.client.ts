import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { EnvConfig } from '@config/env.config';

export class S3Service {
  private s3Client: S3Client;
  private bucket: string;

  constructor(config: EnvConfig) {
    this.s3Client = new S3Client({
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

  async uploadCV(
    key: string,
    body: Buffer,
    contentType: string = 'application/pdf'
  ): Promise<string> {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        })
      );
      return `s3://${this.bucket}/${key}`;
    } catch (error) {
      throw new Error(
        `Failed to upload CV: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async downloadCV(key: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      const stream = response.Body as Readable;
      const chunks: Buffer[] = [];

      return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', (err) => reject(new Error(`Failed to download CV: ${err.message}`)));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
      });
    } catch (error) {
      throw new Error(
        `Failed to download CV: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async deleteCV(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
    } catch (error) {
      throw new Error(
        `Failed to delete CV: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async generatePresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      return await getSignedUrl(this.s3Client as any, command, { expiresIn });
    } catch (error) {
      throw new Error(
        `Failed to generate presigned URL: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
