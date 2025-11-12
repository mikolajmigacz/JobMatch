import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class S3ClientProvider {
  private readonly client: S3Client;

  constructor(private configService: ConfigService) {
    this.client = new S3Client({
      endpoint: this.configService.getOrThrow('S3_ENDPOINT'),
      region: this.configService.getOrThrow('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
      forcePathStyle: true,
    });
  }

  get s3(): S3Client {
    return this.client;
  }
}
