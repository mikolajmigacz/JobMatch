import { UpdateProfileRequest, UpdateProfileResponse } from '@jobmatch/shared';
import { UserRepository } from '@domain/repositories/user.repository';

export class UpdateProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const updates: Record<string, unknown> = {};

    if (request.firstName !== undefined) {
      updates.firstName = request.firstName;
    }

    if (request.lastName !== undefined) {
      updates.lastName = request.lastName;
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
