import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3ClientProvider } from '../s3/client';
import { IFileStorageService } from '@domain/services/file-storage.service';

@Injectable()
export class S3FileStorageService implements IFileStorageService {
  constructor(
    private s3ClientProvider: S3ClientProvider,
    private configService: ConfigService
  ) {}

  async uploadFile(
    bucket: string,
    key: string,
    body: Buffer,
    contentType: string
  ): Promise<string> {
    await this.s3ClientProvider.s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    );

    const baseUrl =
      this.configService.get<string>('PUBLIC_S3_BASE_URL') ??
      this.configService.getOrThrow<string>('S3_ENDPOINT');
    return `${baseUrl}/${bucket}/${key}`;
  }
}
