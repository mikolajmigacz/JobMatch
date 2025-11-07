import { Module } from '@nestjs/common';
import { IPasswordService } from '@domain/services/password.service';
import { ITokenService } from '@domain/services/token.service';
import { IUserRepository } from '@domain/repositories/user.repository';
import { BcryptPasswordService } from '@infrastructure/services/bcrypt-password.service';
import { JwtTokenService } from '@infrastructure/services/jwt-token.service';
import { DynamoDbUserRepository } from '@infrastructure/repositories/dynamodb-user.repository';
import { RegisterUseCase } from '@application/use-cases/register.use-case';
import { LoginUseCase } from '@application/use-cases/login.use-case';
import { GetCurrentUserUseCase } from '@application/use-cases/get-current-user.use-case';
import { ValidateTokenUseCase } from '@application/use-cases/validate-token.use-case';
import { AuthenticationService } from '@application/authentication.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: IPasswordService,
      useClass: BcryptPasswordService,
    },
    {
      provide: ITokenService,
      useClass: JwtTokenService,
    },
    {
      provide: IUserRepository,
      useClass: DynamoDbUserRepository,
    },
    RegisterUseCase,
    LoginUseCase,
    GetCurrentUserUseCase,
    ValidateTokenUseCase,
    AuthenticationService,
  ],
  exports: [AuthenticationService],
})
export class AuthModule {}
