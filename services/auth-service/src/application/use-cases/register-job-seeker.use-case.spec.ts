import { RegisterJobSeekerUseCase } from './register-job-seeker.use-case';
import { IUserRepository } from '@domain/repositories/user.repository';
import { IPasswordService } from '@domain/services/password.service';
import { ITokenService } from '@domain/services/token.service';
import { User, UserRole } from '@domain/entities/user';
import { UserAlreadyExistsException } from '@shared/exceptions/auth.exceptions';

describe('RegisterJobSeekerUseCase', () => {
  let useCase: RegisterJobSeekerUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let passwordService: jest.Mocked<IPasswordService>;
  let tokenService: jest.Mocked<ITokenService>;

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

    useCase = new RegisterJobSeekerUseCase(userRepository, passwordService, tokenService);
  });

  describe('execute', () => {
    it('should successfully register a job seeker', async () => {
      const request = {
        email: 'jobseeker@test.com',
        password: 'SecurePass123!@',
        role: 'job_seeker' as const,
        name: 'John Doe',
      };

      userRepository.findByEmail.mockResolvedValue(null);
      passwordService.hash.mockResolvedValue('hashed-password');
      tokenService.generateToken.mockResolvedValue('jwt-token');

      const result = await useCase.execute(request);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(request.email);
      expect(passwordService.hash).toHaveBeenCalledWith(request.password);
      expect(userRepository.save).toHaveBeenCalled();
      expect(tokenService.generateToken).toHaveBeenCalled();

      expect(result).toEqual(
        expect.objectContaining({
          token: 'jwt-token',
          user: expect.objectContaining({
            email: request.email,
            name: request.name,
            role: UserRole.JOB_SEEKER,
          }),
        })
      );
    });

    it('should throw UserAlreadyExistsException if email exists', async () => {
      const request = {
        email: 'existing@test.com',
        password: 'SecurePass123!@',
        role: 'job_seeker' as const,
        name: 'John Doe',
      };

      const existingUser = User.create(request.email, 'hashed', UserRole.JOB_SEEKER, request.name);
      userRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(useCase.execute(request)).rejects.toThrow(UserAlreadyExistsException);
    });

    it('should hash password before saving', async () => {
      const request = {
        email: 'jobseeker@test.com',
        password: 'SecurePass123!@',
        role: 'job_seeker' as const,
        name: 'John Doe',
      };

      userRepository.findByEmail.mockResolvedValue(null);
      passwordService.hash.mockResolvedValue('hashed-password');
      tokenService.generateToken.mockResolvedValue('jwt-token');

      await useCase.execute(request);

      expect(passwordService.hash).toHaveBeenCalledWith(request.password);
    });

    it('should not include company fields in response for job seeker', async () => {
      const request = {
        email: 'jobseeker@test.com',
        password: 'SecurePass123!@',
        role: 'job_seeker' as const,
        name: 'John Doe',
      };

      userRepository.findByEmail.mockResolvedValue(null);
      passwordService.hash.mockResolvedValue('hashed-password');
      tokenService.generateToken.mockResolvedValue('jwt-token');

      const result = await useCase.execute(request);

      expect(result.user).not.toHaveProperty('companyName');
      expect(result.user).not.toHaveProperty('companyLogoUrl');
    });
  });
});
