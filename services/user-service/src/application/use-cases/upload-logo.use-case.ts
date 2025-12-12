import { UploadLogoResponse } from '@jobmatch/shared';
import { UserRepository } from '@domain/repositories/user.repository';
import { S3FileStorageService } from '@infrastructure/services/s3-file-storage.service';

export interface UploadLogoFileRequest {
  userId: string;
  fileBuffer: Buffer;
  mimeType: string;
}

export class UploadLogoUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3FileStorageService
  ) {}

  async execute(request: UploadLogoFileRequest): Promise<UploadLogoResponse> {
    const key = `logos/${request.userId}/${Date.now()}.${this.getFileExtension(request.mimeType)}`;

    const logoUrl = await this.s3Service.uploadFile(key, request.fileBuffer, request.mimeType);

    const user = await this.userRepository.getById(request.userId);
    if (user?.companyLogoUrl) {
      const oldKey = this.extractKeyFromS3Url(user.companyLogoUrl);
      if (oldKey) {
        try {
          await this.s3Service.deleteFile(oldKey);
        } catch {}
      }
    }

    return this.userRepository.update(request.userId, {
      companyLogoUrl: logoUrl,
    });
  }

  private getFileExtension(mimeType: string): string {
    const ext = mimeType.split('/')[1];
    return ext === 'jpeg' ? 'jpg' : ext || 'jpg';
  }

  private extractKeyFromS3Url(url: string): string | null {
    const match = url.match(/s3:\/\/[^/]+\/(.+)/);
    return match ? match[1] : null;
  }
}
