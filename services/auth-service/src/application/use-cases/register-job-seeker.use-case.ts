import { Injectable, Inject } from '@nestjs/common';
import { User, UserRole } from '@domain/entities/user';
import { IUserRepository } from '@domain/repositories/user.repository';
import { IPasswordService } from '@domain/services/password.service';
import { ITokenService } from '@domain/services/token.service';
import { UserAlreadyExistsException } from '@shared/exceptions/auth.exceptions';
import { JobSeekerRegister, AuthResponse, PublicUser } from '@jobmatch/shared';

@Injectable()
export class RegisterJobSeekerUseCase {
  constructor(
    @Inject(IUserRepository) private userRepository: IUserRepository,
    @Inject(IPasswordService) private passwordService: IPasswordService,
    @Inject(ITokenService) private tokenService: ITokenService
  ) {}

  async execute(request: JobSeekerRegister): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new UserAlreadyExistsException(request.email);
    }

    const hashedPassword = await this.passwordService.hash(request.password);

    const user = User.create(request.email, hashedPassword, UserRole.JOB_SEEKER, request.name);

    await this.userRepository.save(user);

    const token = await this.tokenService.generateToken({
      userId: user.userId.value,
      email: user.email,
      role: user.role,
    });

    const userResponse = this.buildUserResponse(user);

    return {
      token,
      user: userResponse,
    };
  }

  private buildUserResponse(user: User): PublicUser {
    return {
      userId: user.userId.value,
      email: user.email,
      role: user.role,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
