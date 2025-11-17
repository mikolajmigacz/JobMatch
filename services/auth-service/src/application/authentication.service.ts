import { Injectable } from '@nestjs/common';

import { LoginUseCase } from './use-cases/login.use-case';
import { GetCurrentUserUseCase } from './use-cases/get-current-user.use-case';
import { ValidateTokenUseCase } from './use-cases/validate-token.use-case';
import { TokenPayload } from '@domain/services/token.service';
import {
  JobSeekerRegister,
  EmployerRegister,
  LoginRequest,
  AuthResponse,
  PublicUser,
} from '@jobmatch/shared';
import { RegisterJobSeekerUseCase } from './use-cases/register-job-seeker.use-case';
import { RegisterEmployerUseCase } from './use-cases/register-employer.use-case';

@Injectable()
export class AuthenticationService {
  constructor(
    private registerJobSeekerUseCase: RegisterJobSeekerUseCase,
    private registerEmployerUseCase: RegisterEmployerUseCase,
    private loginUseCase: LoginUseCase,
    private getCurrentUserUseCase: GetCurrentUserUseCase,
    private validateTokenUseCase: ValidateTokenUseCase
  ) {}

  async registerJobSeeker(request: JobSeekerRegister): Promise<AuthResponse> {
    return this.registerJobSeekerUseCase.execute(request);
  }

  async registerEmployer(
    request: EmployerRegister,
    file: { buffer: Buffer; mimetype: string }
  ): Promise<AuthResponse> {
    return this.registerEmployerUseCase.execute(request, file);
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
