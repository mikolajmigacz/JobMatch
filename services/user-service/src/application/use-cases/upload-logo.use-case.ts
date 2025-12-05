import { UploadLogoRequest, UploadLogoResponse } from '@jobmatch/shared';
import { UserRepository } from '@domain/repositories/user.repository';

export class UploadLogoUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: UploadLogoRequest): Promise<UploadLogoResponse> {
    return this.userRepository.update(request.userId, {
      companyLogoUrl: request.logoUrl,
    });
  }
}
