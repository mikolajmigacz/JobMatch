import { randomUUID } from 'crypto';
import { UpdateProfileUseCase } from '../../../src/application/use-cases';
import { UserRepository } from '../../../src/domain/repositories/user.repository';

describe('UpdateProfileUseCase', () => {
  let useCase: UpdateProfileUseCase;
  let mockRepository: jest.Mocked<Partial<UserRepository>>;

  beforeEach(() => {
    mockRepository = {
      getById: jest.fn(),
      update: jest.fn(),
    };
    useCase = new UpdateProfileUseCase(mockRepository as unknown as UserRepository);
  });

  it('should update user profile and return updated user', async () => {
    const userId = randomUUID();
    const updatedProfile = {
      userId,
      email: 'user@example.com',
      role: 'employer' as const,
      name: 'John Updated',
      companyName: 'Tech Corp',
      companyLogoUrl: 'https://example.com/logo.png',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (mockRepository.update as jest.Mock).mockResolvedValueOnce(updatedProfile);

    const result = await useCase.execute({
      userId,
      name: 'John Updated',
      companyName: 'Tech Corp',
      companyLogoUrl: 'https://example.com/logo.png',
    });

    expect(result).toEqual(updatedProfile);
    expect(mockRepository.update).toHaveBeenCalledWith(userId, {
      name: 'John Updated',
      companyName: 'Tech Corp',
      companyLogoUrl: 'https://example.com/logo.png',
    });
  });

  it('should return current profile when no updates provided', async () => {
    const userId = randomUUID();
    const profile = {
      userId,
      email: 'user@example.com',
      role: 'job_seeker' as const,
      name: 'John Doe',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (mockRepository.getById as jest.Mock).mockResolvedValueOnce(profile);

    const result = await useCase.execute({ userId });

    expect(result).toEqual(profile);
    expect(mockRepository.getById).toHaveBeenCalledWith(userId);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it('should only update provided fields', async () => {
    const userId = randomUUID();
    const updatedProfile = {
      userId,
      email: 'user@example.com',
      role: 'employer' as const,
      name: 'Jane Updated',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (mockRepository.update as jest.Mock).mockResolvedValueOnce(updatedProfile);

    const result = await useCase.execute({
      userId,
      name: 'Jane Updated',
    });

    expect(result).toEqual(updatedProfile);
    expect(mockRepository.update).toHaveBeenCalledWith(userId, {
      name: 'Jane Updated',
    });
  });
});
