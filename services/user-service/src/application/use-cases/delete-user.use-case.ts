import { DeleteUserRequest, DeleteUserResponse } from '@jobmatch/shared';
import { UserRepository } from '@domain/repositories/user.repository';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: DeleteUserRequest): Promise<DeleteUserResponse> {
    await this.userRepository.delete(request.userId);
  }
}
