import { LoginUseCase } from './login.use-case';

describe('LoginUseCase - Unit Tests', () => {
  let useCase: LoginUseCase;
  let mockUserRepository: Record<string, jest.Mock>;
  let mockPasswordService: Record<string, jest.Mock>;
  let mockTokenService: Record<string, jest.Mock>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
    };
    mockPasswordService = {
      compare: jest.fn(),
    };
    mockTokenService = {
      generateToken: jest.fn(),
    };

    useCase = new LoginUseCase(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUserRepository as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPasswordService as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockTokenService as any
    );
  });

  describe('execute - successful login', () => {
    it('should return token and user data on successful login', async () => {
      const loginRequest = { email: 'test@example.com', password: 'Password123!' };
      const mockUser = {
        userId: { value: '123' },
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'job_seeker',
        name: 'Test User',
        companyName: null,
        companyLogoUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.compare.mockResolvedValue(true);
      mockTokenService.generateToken.mockResolvedValue('valid.jwt.token');

      const result = await useCase.execute(loginRequest);

      expect(result.token).toBe('valid.jwt.token');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.role).toBe('job_seeker');
    });

    it('should call findByEmail with provided email', async () => {
      const loginRequest = { email: 'user@test.com', password: 'Pass123!' };
      const mockUser = {
        userId: { value: '123' },
        email: 'user@test.com',
        password: 'hashed',
        role: 'job_seeker',
        name: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.compare.mockResolvedValue(true);
      mockTokenService.generateToken.mockResolvedValue('token');

      await useCase.execute(loginRequest);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('user@test.com');
    });

    it('should generate token with correct payload', async () => {
      const loginRequest = { email: 'test@example.com', password: 'Pass123!' };
      const mockUser = {
        userId: { value: 'user-id-123' },
        email: 'test@example.com',
        password: 'hashed',
        role: 'employer',
        name: 'Employer',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.compare.mockResolvedValue(true);
      mockTokenService.generateToken.mockResolvedValue('token');

      await useCase.execute(loginRequest);

      expect(mockTokenService.generateToken).toHaveBeenCalledWith({
        userId: 'user-id-123',
        email: 'test@example.com',
        role: 'employer',
      });
    });
  });

  describe('execute - error cases', () => {
    it('should throw InvalidCredentialsException when user not found', async () => {
      const loginRequest = { email: 'nonexistent@example.com', password: 'Pass123!' };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(useCase.execute(loginRequest)).rejects.toThrow('Invalid email or password');
    });

    it('should throw InvalidCredentialsException when password is incorrect', async () => {
      const loginRequest = { email: 'test@example.com', password: 'WrongPassword!' };
      const mockUser = {
        userId: { value: '123' },
        email: 'test@example.com',
        password: 'correctHashedPassword',
        role: 'job_seeker',
        name: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.compare.mockResolvedValue(false);

      await expect(useCase.execute(loginRequest)).rejects.toThrow('Invalid email or password');
    });

    it('should not call generateToken when user not found', async () => {
      const loginRequest = { email: 'nonexistent@example.com', password: 'Pass123!' };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      try {
        await useCase.execute(loginRequest);
      } catch {
        // expected
      }

      expect(mockTokenService.generateToken).not.toHaveBeenCalled();
    });

    it('should not call generateToken when password is wrong', async () => {
      const loginRequest = { email: 'test@example.com', password: 'WrongPass!' };
      const mockUser = {
        userId: { value: '123' },
        email: 'test@example.com',
        password: 'hashed',
        role: 'job_seeker',
        name: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.compare.mockResolvedValue(false);

      try {
        await useCase.execute(loginRequest);
      } catch {
        // expected
      }

      expect(mockTokenService.generateToken).not.toHaveBeenCalled();
    });
  });

  describe('execute - edge cases', () => {
    it('should handle employer role correctly', async () => {
      const loginRequest = { email: 'employer@test.com', password: 'Pass123!' };
      const mockUser = {
        userId: { value: 'emp-123' },
        email: 'employer@test.com',
        password: 'hashed',
        role: 'employer',
        name: 'Company Inc',
        companyName: 'Company Inc',
        companyLogoUrl: 'https://s3.amazonaws.com/logo.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.compare.mockResolvedValue(true);
      mockTokenService.generateToken.mockResolvedValue('token');

      const result = await useCase.execute(loginRequest);

      expect(result.user.role).toBe('employer');
      expect(result.user.companyLogoUrl).toBe('https://s3.amazonaws.com/logo.png');
    });

    it('should return ISO date strings', async () => {
      const loginRequest = { email: 'test@example.com', password: 'Pass123!' };
      const now = new Date();
      const mockUser = {
        userId: { value: '123' },
        email: 'test@example.com',
        password: 'hashed',
        role: 'job_seeker',
        name: 'User',
        createdAt: now,
        updatedAt: now,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.compare.mockResolvedValue(true);
      mockTokenService.generateToken.mockResolvedValue('token');

      const result = await useCase.execute(loginRequest);

      expect(result.user.createdAt).toBe(now.toISOString());
      expect(result.user.updatedAt).toBe(now.toISOString());
    });
  });
});
