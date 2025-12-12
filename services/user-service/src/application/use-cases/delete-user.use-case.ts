import { DeleteUserRequest, DeleteUserResponse } from '@jobmatch/shared';
import { UserRepository } from '@domain/repositories/user.repository';
import { S3FileStorageService } from '@infrastructure/services/s3-file-storage.service';

export class DeleteUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3FileStorageService
  ) {}

  async execute(request: DeleteUserRequest): Promise<DeleteUserResponse> {
    const user = await this.userRepository.getById(request.userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.companyLogoUrl) {
      const logoKey = this.extractKeyFromS3Url(user.companyLogoUrl);
      if (logoKey) {
        try {
          await this.s3Service.deleteFile(logoKey);
        } catch {
          // Ignore S3 deletion errors
        }
      }
    }

    await this.userRepository.delete(request.userId);
  }

  private extractKeyFromS3Url(url: string): string | null {
    const match = url.match(/s3:\/\/[^/]+\/(.+)/);
    return match ? match[1] : null;
  }
}
