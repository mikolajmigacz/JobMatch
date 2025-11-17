import { RegisterUseCase } from './register.use-case';
import type { RegisterRequest } from '@jobmatch/shared';

describe('RegisterUseCase - Unit Tests', () => {
  let useCase: RegisterUseCase;
  let mockUserRepository: Record<string, jest.Mock>;
  let mockPasswordService: Record<string, jest.Mock>;
  let mockTokenService: Record<string, jest.Mock>;
  let mockFileStorageService: Record<string, jest.Mock>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };
    mockPasswordService = {
      hash: jest.fn(),
    };
    mockTokenService = {
      generateToken: jest.fn(),
    };
    mockFileStorageService = {
      uploadFile: jest.fn(),
    };

    useCase = new RegisterUseCase(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUserRepository as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPasswordService as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockTokenService as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockFileStorageService as any
    );
  });

  describe('execute - job seeker registration', () => {
    it('should register job seeker without logo', async () => {
      const registerRequest: RegisterRequest = {
        email: 'jobseeker@example.com',
        password: 'Password123!',
        role: 'job_seeker',
        name: 'Job Seeker',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordService.hash.mockResolvedValue('hashed-password');
      mockTokenService.generateToken.mockResolvedValue('jwt-token');
      mockUserRepository.save.mockResolvedValue(undefined);

      const result = await useCase.execute(registerRequest);

      expect(result.user.email).toBe('jobseeker@example.com');
      expect(result.user.role).toBe('job_seeker');
      expect(result.token).toBe('jwt-token');
    });

    it('should hash password before storing', async () => {
      const registerRequest: RegisterRequest = {
        email: 'hash@example.com',
        password: 'PlainPassword123!',
        role: 'job_seeker',
        name: 'User',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordService.hash.mockResolvedValue('hashed-password');
      mockTokenService.generateToken.mockResolvedValue('jwt-token');
      mockUserRepository.save.mockResolvedValue(undefined);

      await useCase.execute(registerRequest);

      expect(mockPasswordService.hash).toHaveBeenCalledWith('PlainPassword123!');
    });
  });

  describe('execute - employer registration', () => {
    it('should throw error when employer registers without logo', async () => {
      const registerRequest: RegisterRequest = {
        email: 'employer@example.com',
        password: 'Password123!',
        role: 'employer',
        name: 'Employer',
        companyName: 'Company Inc',
      };

      await expect(useCase.execute(registerRequest)).rejects.toThrow('Logo is required');
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should register employer successfully with logo', async () => {
      const registerRequest: RegisterRequest = {
        email: 'employer@example.com',
        password: 'Password123!',
        role: 'employer',
        name: 'Employer',
        companyName: 'Company Inc',
      };
      const logoFile = { buffer: Buffer.from('image data'), mimetype: 'image/png' };
      const logoUrl = 'https://s3.amazonaws.com/logos/employer@example.com/123-1234567890';

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordService.hash.mockResolvedValue('hashedPassword');
      mockFileStorageService.uploadFile.mockResolvedValue(logoUrl);
      mockTokenService.generateToken.mockResolvedValue('token');
      mockUserRepository.save.mockResolvedValue(undefined);

      const result = await useCase.execute(registerRequest, logoFile);

      expect(result.user.companyLogoUrl).toBe(logoUrl);
      expect(mockFileStorageService.uploadFile).toHaveBeenCalled();
    });

    it('should upload logo to S3 with correct key format', async () => {
      const registerRequest: RegisterRequest = {
        email: 'employer@test.com',
        password: 'Pass123!',
        role: 'employer',
        name: 'Emp',
        companyName: 'Company',
      };
      const logoFile = { buffer: Buffer.from('test'), mimetype: 'image/jpeg' };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordService.hash.mockResolvedValue('hashed');
      mockFileStorageService.uploadFile.mockResolvedValue('url');
      mockTokenService.generateToken.mockResolvedValue('token');
      mockUserRepository.save.mockResolvedValue(undefined);

      await useCase.execute(registerRequest, logoFile);

      const callArgs = mockFileStorageService.uploadFile.mock.calls[0];
      expect(callArgs[1]).toContain('logos/employer@test.com/');
    });
  });

  describe('execute - error cases', () => {
    it('should throw UserAlreadyExistsException when email already registered', async () => {
      const registerRequest: RegisterRequest = {
        email: 'existing@example.com',
        password: 'Password123!',
        role: 'job_seeker',
        name: 'User',
      };

      mockUserRepository.findByEmail.mockResolvedValue({ email: 'existing@example.com' });

      await expect(useCase.execute(registerRequest)).rejects.toThrow();
      expect(mockPasswordService.hash).not.toHaveBeenCalled();
    });

    it('should check email uniqueness before hashing password', async () => {
      const registerRequest: RegisterRequest = {
        email: 'duplicate@example.com',
        password: 'Password123!',
        role: 'job_seeker',
        name: 'User',
      };

      mockUserRepository.findByEmail.mockResolvedValue({ email: 'duplicate@example.com' });

      try {
        await useCase.execute(registerRequest);
      } catch {
        // expected
      }

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('duplicate@example.com');
      expect(mockPasswordService.hash).not.toHaveBeenCalled();
    });
  });

  describe('execute - token generation', () => {
    it('should generate token with correct payload', async () => {
      const registerRequest: {
        email: string;
        password: string;
        role: 'job_seeker' | 'employer';
        name: string;
      } = {
        email: 'user@example.com',
        password: 'Pass123!',
        role: 'job_seeker',
        name: 'User',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordService.hash.mockResolvedValue('hashed');
      mockTokenService.generateToken.mockResolvedValue('token');
      mockUserRepository.save.mockResolvedValue(undefined);

      await useCase.execute(registerRequest);

      expect(mockTokenService.generateToken).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'user@example.com',
          role: 'job_seeker',
        })
      );
    });

    it('should include userId in token payload', async () => {
      const registerRequest: {
        email: string;
        password: string;
        role: 'job_seeker' | 'employer';
        name: string;
      } = {
        email: 'user@example.com',
        password: 'Pass123!',
        role: 'job_seeker',
        name: 'User',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordService.hash.mockResolvedValue('hashed');
      mockTokenService.generateToken.mockResolvedValue('token');
      mockUserRepository.save.mockResolvedValue(undefined);

      await useCase.execute(registerRequest);

      const tokenCall = mockTokenService.generateToken.mock.calls[0][0];
      expect(tokenCall.userId).toBeDefined();
    });
  });

  describe('execute - data persistence', () => {
    it('should save user to repository', async () => {
      const registerRequest: {
        email: string;
        password: string;
        role: 'job_seeker' | 'employer';
        name: string;
      } = {
        email: 'user@example.com',
        password: 'Pass123!',
        role: 'job_seeker',
        name: 'User',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordService.hash.mockResolvedValue('hashed');
      mockTokenService.generateToken.mockResolvedValue('token');
      mockUserRepository.save.mockResolvedValue(undefined);

      await useCase.execute(registerRequest);

      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should return user data with ISO date strings', async () => {
      const registerRequest: {
        email: string;
        password: string;
        role: 'job_seeker' | 'employer';
        name: string;
      } = {
        email: 'user@example.com',
        password: 'Pass123!',
        role: 'job_seeker',
        name: 'User',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordService.hash.mockResolvedValue('hashed');
      mockTokenService.generateToken.mockResolvedValue('token');
      mockUserRepository.save.mockResolvedValue(undefined);

      const result = await useCase.execute(registerRequest);

      expect(typeof result.user.createdAt).toBe('string');
      expect(typeof result.user.updatedAt).toBe('string');
      expect(result.user.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });
});
