import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '@domain/services/token.service';

@Injectable()
export class JwtTokenService implements ITokenService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor(private configService: ConfigService) {
    this.secret = this.configService.get<string>('JWT_SECRET') as string;
    this.expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') as string;
  }

  async generateToken(payload: TokenPayload): Promise<string> {
    const token = jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as jwt.SignOptions);
    return token;
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, this.secret) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
