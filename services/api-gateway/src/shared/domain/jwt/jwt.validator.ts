import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import { TokenPayload } from './jwt.types';
import { JWT_ERROR_NAMES, ERROR_MESSAGES } from '@/shared/constants/auth.constants';

@Injectable()
export class JwtValidator {
  constructor(private readonly configService: ConfigService) {}

  validate(token: string): TokenPayload {
    const secret = this.configService.get<string>('JWT_SECRET');

    try {
      return verify(token, secret as string) as TokenPayload;
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof Error && error.name === JWT_ERROR_NAMES.TOKEN_EXPIRED) {
      throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_EXPIRED);
    }
    throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
  }
}
