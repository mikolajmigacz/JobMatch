import { RegisterEmployerUseCase } from './register-employer.use-case';
import { IUserRepository } from '@domain/repositories/user.repository';
import { IPasswordService } from '@domain/services/password.service';
import { ITokenService } from '@domain/services/token.service';
import { IFileStorageService } from '@domain/services/file-storage.service';
import { User, UserRole } from '@domain/entities/user';
import { UserAlreadyExistsException } from '@shared/exceptions/auth.exceptions';

describe('RegisterEmployerUseCase', () => {
  let useCase: RegisterEmployerUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let passwordService: jest.Mocked<IPasswordService>;
  let tokenService: jest.Mocked<ITokenService>;
  let fileStorageService: jest.Mocked<IFileStorageService>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    passwordService = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as jest.Mocked<IPasswordService>;

    tokenService = {
      generateToken: jest.fn(),
      verifyToken: jest.fn(),
    } as jest.Mocked<ITokenService>;

    fileStorageService = {
      uploadFile: jest.fn(),
    } as jest.Mocked<IFileStorageService>;

    useCase = new RegisterEmployerUseCase(
      userRepository,
      passwordService,
      tokenService,
      fileStorageService
    );
  });

  describe('execute', () => {
    it('should successfully register an employer with logo', async () => {
      const request = {
        email: 'employer@test.com',
        password: 'SecurePass123!@',
        role: 'employer' as const,
        name: 'ACME Corp',
        companyName: 'ACME Corporation',
      };

      const logoFile = {
        buffer: Buffer.from('fake-image-data'),
        mimetype: 'image/png',
      };

      userRepository.findByEmail.mockResolvedValue(null);
      passwordService.hash.mockResolvedValue('hashed-password');
      fileStorageService.uploadFile.mockResolvedValue('https://s3.com/logo.png');
      tokenService.generateToken.mockResolvedValue('jwt-token');

      const result = await useCase.execute(request, logoFile);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(request.email);
      expect(passwordService.hash).toHaveBeenCalledWith(request.password);
      expect(fileStorageService.uploadFile).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
      expect(tokenService.generateToken).toHaveBeenCalled();

      expect(result).toEqual(
        expect.objectContaining({
          token: 'jwt-token',
          user: expect.objectContaining({
            email: request.email,
            name: request.name,
            role: UserRole.EMPLOYER,
            companyName: request.companyName,
            companyLogoUrl: 'https://s3.com/logo.png',
          }),
        })
      );
    });

    it('should throw UserAlreadyExistsException if email exists', async () => {
      const request = {
        email: 'existing@test.com',
        password: 'SecurePass123!@',
        role: 'employer' as const,
        name: 'ACME Corp',
        companyName: 'ACME Corporation',
      };

      const logoFile = {
        buffer: Buffer.from('fake-image-data'),
        mimetype: 'image/png',
      };

      const existingUser = User.create(
        request.email,
        'hashed',
        UserRole.EMPLOYER,
        request.name,
        request.companyName
      );
      userRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(useCase.execute(request, logoFile)).rejects.toThrow(UserAlreadyExistsException);
    });

    it('should upload logo to S3', async () => {
      const request = {
        email: 'employer@test.com',
        password: 'SecurePass123!@',
        role: 'employer' as const,
        name: 'ACME Corp',
        companyName: 'ACME Corporation',
      };

      const logoFile = {
        buffer: Buffer.from('fake-image-data'),
        mimetype: 'image/png',
      };

      userRepository.findByEmail.mockResolvedValue(null);
      passwordService.hash.mockResolvedValue('hashed-password');
      fileStorageService.uploadFile.mockResolvedValue('https://s3.com/logo.png');
      tokenService.generateToken.mockResolvedValue('jwt-token');

      await useCase.execute(request, logoFile);

      expect(fileStorageService.uploadFile).toHaveBeenCalledWith(
        process.env.S3_BUCKET,
        expect.stringContaining(`logos/${request.email}/`),
        logoFile.buffer,
        logoFile.mimetype
      );
    });

    it('should include company fields in response for employer', async () => {
      const request = {
        email: 'employer@test.com',
        password: 'SecurePass123!@',
        role: 'employer' as const,
        name: 'ACME Corp',
        companyName: 'ACME Corporation',
      };

      const logoFile = {
        buffer: Buffer.from('fake-image-data'),
        mimetype: 'image/png',
      };

      userRepository.findByEmail.mockResolvedValue(null);
      passwordService.hash.mockResolvedValue('hashed-password');
      fileStorageService.uploadFile.mockResolvedValue('https://s3.com/logo.png');
      tokenService.generateToken.mockResolvedValue('jwt-token');

      const result = await useCase.execute(request, logoFile);

      expect(result.user).toHaveProperty('companyName', request.companyName);
      expect(result.user).toHaveProperty('companyLogoUrl');
    });
  });
});
