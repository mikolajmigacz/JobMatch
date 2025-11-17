import { Injectable, Inject } from '@nestjs/common';
import { User, UserRole } from '@domain/entities/user';
import { IUserRepository } from '@domain/repositories/user.repository';
import { IPasswordService } from '@domain/services/password.service';
import { ITokenService } from '@domain/services/token.service';
import { IFileStorageService } from '@domain/services/file-storage.service';
import { UserAlreadyExistsException } from '@shared/exceptions/auth.exceptions';
import { EmployerRegister, AuthResponse, PublicUser } from '@jobmatch/shared';

@Injectable()
export class RegisterEmployerUseCase {
  constructor(
    @Inject(IUserRepository) private userRepository: IUserRepository,
    @Inject(IPasswordService) private passwordService: IPasswordService,
    @Inject(ITokenService) private tokenService: ITokenService,
    @Inject(IFileStorageService) private fileStorageService: IFileStorageService
  ) {}

  async execute(
    request: EmployerRegister,
    logoFile: { buffer: Buffer; mimetype: string }
  ): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new UserAlreadyExistsException(request.email);
    }

    const hashedPassword = await this.passwordService.hash(request.password);

    let user = User.create(
      request.email,
      hashedPassword,
      UserRole.EMPLOYER,
      request.name,
      request.companyName
    );

    const key = `logos/${request.email}/${logoFile.buffer.length}-${Date.now()}`;
    const logoUrl = await this.fileStorageService.uploadFile(
      process.env.S3_BUCKET as string,
      key,
      logoFile.buffer,
      logoFile.mimetype
    );
    user = user.setCompanyLogoUrl(logoUrl);

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
    const response: PublicUser = {
      userId: user.userId.value,
      email: user.email,
      role: user.role,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    response.companyName = user.companyName || null;
    response.companyLogoUrl = user.companyLogoUrl || null;

    return response;
  }
}
