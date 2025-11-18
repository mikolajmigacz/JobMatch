import { GetProfileRequest, GetProfileResponse } from '@jobmatch/shared';
import { UserRepository } from '@domain/repositories/user.repository';

export class GetProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: GetProfileRequest): Promise<GetProfileResponse> {
    return this.userRepository.getById(request.userId);
  }
}
