import { randomUUID } from 'crypto';
import { GetProfileUseCase } from '../../../src/application/use-cases';
import { UserRepository } from '../../../src/domain/repositories/user.repository';

describe('GetProfileUseCase', () => {
  let useCase: GetProfileUseCase;
  let mockRepository: jest.Mocked<Partial<UserRepository>>;

  beforeEach(() => {
    mockRepository = {
      getById: jest.fn(),
    };
    useCase = new GetProfileUseCase(mockRepository as unknown as UserRepository);
  });

  it('should return user profile when user exists', async () => {
    const userId = randomUUID();
    const userProfile = {
      userId,
      email: 'user@example.com',
      role: 'job_seeker' as const,
      name: 'John Doe',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (mockRepository.getById as jest.Mock).mockResolvedValueOnce(userProfile);

    const result = await useCase.execute({ userId });

    expect(result).toEqual(userProfile);
    expect(mockRepository.getById).toHaveBeenCalledWith(userId);
  });

  it('should return null when user does not exist', async () => {
    const userId = randomUUID();
    (mockRepository.getById as jest.Mock).mockResolvedValueOnce(null);

    const result = await useCase.execute({ userId });

    expect(result).toBeNull();
    expect(mockRepository.getById).toHaveBeenCalledWith(userId);
  });
});
