import { Injectable, Inject } from '@nestjs/common';
import { ITokenService, TokenPayload } from '@domain/services/token.service';
import { InvalidTokenException } from '@shared/exceptions/auth.exceptions';

@Injectable()
export class ValidateTokenUseCase {
  constructor(@Inject(ITokenService) private tokenService: ITokenService) {}

  async execute(token: string): Promise<TokenPayload> {
    try {
      return await this.tokenService.verifyToken(token);
    } catch {
      throw new InvalidTokenException();
    }
  }
}
