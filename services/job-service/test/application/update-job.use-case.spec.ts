import { UpdateJobUseCase } from '../../src/application/use-cases';
import { Job, JobId, IJobRepository } from '../../src/domain';

describe('UpdateJobUseCase', () => {
  let useCase: UpdateJobUseCase;
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

    useCase = new UpdateJobUseCase(repositoryMock);
  });

  it('should update job if owner', async () => {
    const jobId = JobId.generate();

    (repositoryMock.findById as jest.Mock).mockResolvedValue(
      Job.restore(
        jobId,
        'employer-123',
        'Old Title',
        'Old Description',
        'NYC',
        undefined,
        undefined,
        'full-time',
        ['Node.js'],
        'Experience required',
        'OldCompany',
        'active',
        new Date(),
        new Date()
      )
    );

    const result = await useCase.execute({
      jobId: jobId.value,
      employerId: 'employer-123',
      title: 'New Title',
    });

    expect(result.title).toBe('New Title');
    expect(repositoryMock.update).toHaveBeenCalled();
  });

  it('should throw error if job not found', async () => {
    (repositoryMock.findById as jest.Mock).mockResolvedValue(null);

    const jobId = JobId.generate();

    await expect(
      useCase.execute({
        jobId: jobId.value,
        employerId: 'employer-123',
        title: 'New Title',
      })
    ).rejects.toThrow('Job not found');
  });

  it('should throw error if not owner', async () => {
    const jobId = JobId.generate();

    (repositoryMock.findById as jest.Mock).mockResolvedValue(
      Job.restore(
        jobId,
        'different-employer',
        'Title',
        'Description',
        'NYC',
        undefined,
        undefined,
        'full-time',
        ['Node.js'],
        'Experience',
        'Company',
        'active',
        new Date(),
        new Date()
      )
    );

    await expect(
      useCase.execute({
        jobId: jobId.value,
        employerId: 'employer-123',
        title: 'New Title',
      })
    ).rejects.toThrow('Forbidden');
  });
});
