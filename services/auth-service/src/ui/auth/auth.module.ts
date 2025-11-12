import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { IPasswordService } from '@domain/services/password.service';
import { ITokenService } from '@domain/services/token.service';
import { IUserRepository } from '@domain/repositories/user.repository';
import { IFileStorageService } from '@domain/services/file-storage.service';
import { BcryptPasswordService } from '@infrastructure/services/bcrypt-password.service';
import { JwtTokenService } from '@infrastructure/services/jwt-token.service';
import { S3FileStorageService } from '@infrastructure/services/s3-file-storage.service';
import { DynamoDbUserRepository } from '@infrastructure/repositories/dynamodb-user.repository';
import { S3ClientProvider } from '@infrastructure/s3/client';
import { DynamoDbClientProvider } from '@infrastructure/dynamodb/client';
import { RegisterUseCase } from '@application/use-cases/register.use-case';
import { LoginUseCase } from '@application/use-cases/login.use-case';
import { GetCurrentUserUseCase } from '@application/use-cases/get-current-user.use-case';
import { ValidateTokenUseCase } from '@application/use-cases/validate-token.use-case';
import { AuthenticationService } from '@application/authentication.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '@infrastructure/strategies/jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [
    S3ClientProvider,
    DynamoDbClientProvider,
    JwtStrategy,
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
    {
      provide: IFileStorageService,
      useClass: S3FileStorageService,
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
