import { CreateJobUseCase } from '../../src/application/use-cases';
import { Job, IJobRepository } from '../../src/domain';

describe('CreateJobUseCase', () => {
  let useCase: CreateJobUseCase;
  let repositoryMock: IJobRepository;

  beforeEach(() => {
    repositoryMock = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmployerId: jest.fn(),
      findByStatus: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    useCase = new CreateJobUseCase(repositoryMock);
  });

  it('should create and save a job with active status', async () => {
    const input = {
      employerId: 'employer-123',
      title: 'Senior Engineer',
      description: 'Looking for senior developer',
      location: 'San Francisco',
      employmentType: 'full-time' as const,
      skills: ['TypeScript', 'React'],
      requirements: 'Must have 5+ years of experience',
      companyName: 'TechCorp',
      salaryMin: 80000,
      salaryMax: 120000,
    };

    const result = await useCase.execute(input);

    expect(result.status).toBe('active');
    expect(result.title).toBe('Senior Engineer');
    expect(result.employerId).toBe('employer-123');
    expect(repositoryMock.save).toHaveBeenCalledWith(expect.any(Job));
  });

  it('should generate a jobId when creating', async () => {
    const input = {
      employerId: 'employer-123',
      title: 'Developer',
      description: 'Backend role',
      location: 'NYC',
      employmentType: 'part-time' as const,
      skills: ['Node.js'],
      requirements: '3+ years experience',
      companyName: 'Company',
    };

    const result = await useCase.execute(input);

    expect(result.jobId).toBeDefined();
    expect(result.jobId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-/i);
  });

  it('should return created job with timestamps', async () => {
    const input = {
      employerId: 'employer-123',
      title: 'Designer',
      description: 'UI/UX designer needed',
      location: 'Remote',
      employmentType: 'contract' as const,
      skills: ['Figma', 'Design'],
      requirements: 'Portfolio required',
      companyName: 'DesignCo',
    };

    const result = await useCase.execute(input);

    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
    expect(new Date(result.createdAt).getTime()).toBeGreaterThan(0);
  });
});
