import { UpdateProfileRequest, UpdateProfileResponse } from '@jobmatch/shared';
import { UserRepository } from '@domain/repositories/user.repository';

export class UpdateProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const updates: Record<string, unknown> = {};

    if (request.name !== undefined) {
      updates.name = request.name;
    }

    if (request.companyName !== undefined) {
      updates.companyName = request.companyName;
    }

    if (request.companyLogoUrl !== undefined) {
      updates.companyLogoUrl = request.companyLogoUrl;
    }

    if (Object.keys(updates).length === 0) {
      return this.userRepository.getById(request.userId);
    }

    return this.userRepository.update(request.userId, updates);
  }
}
