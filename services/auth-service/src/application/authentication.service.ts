import { Injectable } from '@nestjs/common';
import { RegisterUseCase } from './use-cases/register.use-case';
import { LoginUseCase } from './use-cases/login.use-case';
import { GetCurrentUserUseCase } from './use-cases/get-current-user.use-case';
import { ValidateTokenUseCase } from './use-cases/validate-token.use-case';
import { TokenPayload } from '@domain/services/token.service';
import { RegisterRequest, LoginRequest, AuthResponse, PublicUser } from '@jobmatch/shared';

@Injectable()
export class AuthenticationService {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase,
    private getCurrentUserUseCase: GetCurrentUserUseCase,
    private validateTokenUseCase: ValidateTokenUseCase
  ) {}

  async register(request: RegisterRequest): Promise<AuthResponse> {
    return this.registerUseCase.execute(request);
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    return this.loginUseCase.execute(request);
  }

  async getCurrentUser(token: string): Promise<PublicUser> {
    return this.getCurrentUserUseCase.execute(token);
  }

  async validateToken(token: string): Promise<TokenPayload> {
    return this.validateTokenUseCase.execute(token);
  }
}
