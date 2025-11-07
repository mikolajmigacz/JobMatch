import { Injectable, Inject } from '@nestjs/common';
import { UserId } from '@domain/value-objects/user-id';
import { IUserRepository } from '@domain/repositories/user.repository';
import { ITokenService, TokenPayload } from '@domain/services/token.service';
import { InvalidTokenException } from '@shared/exceptions/auth.exceptions';
import { PublicUser } from '@jobmatch/shared';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject(IUserRepository) private userRepository: IUserRepository,
    @Inject(ITokenService) private tokenService: ITokenService
  ) {}

  async execute(token: string): Promise<PublicUser> {
    let payload: TokenPayload;

    try {
      payload = await this.tokenService.verifyToken(token);
    } catch {
      throw new InvalidTokenException();
    }

    const user = await this.userRepository.findById(UserId.from(payload.userId));
    if (!user) {
      throw new InvalidTokenException();
    }

    return {
      userId: user.userId.value,
      email: user.email,
      role: user.role,
      name: user.name,
      companyName: user.companyName ?? undefined,
      companyLogoUrl: user.companyLogoUrl ?? undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
