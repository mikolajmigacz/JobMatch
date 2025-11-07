import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository';
import { IPasswordService } from '@domain/services/password.service';
import { ITokenService } from '@domain/services/token.service';
import { InvalidCredentialsException } from '@shared/exceptions/auth.exceptions';
import { LoginRequest, AuthResponse } from '@jobmatch/shared';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUserRepository) private userRepository: IUserRepository,
    @Inject(IPasswordService) private passwordService: IPasswordService,
    @Inject(ITokenService) private tokenService: ITokenService
  ) {}

  async execute(request: LoginRequest): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await this.passwordService.compare(request.password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const token = await this.tokenService.generateToken({
      userId: user.userId.value,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        userId: user.userId.value,
        email: user.email,
        role: user.role,
        name: user.name,
        companyName: user.companyName || null,
        companyLogoUrl: user.companyLogoUrl || null,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  }
}
