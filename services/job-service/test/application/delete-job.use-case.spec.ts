import { DeleteJobUseCase } from '../../src/application/use-cases';
import { Job, JobId, IJobRepository } from '../../src/domain';

describe('DeleteJobUseCase', () => {
  let useCase: DeleteJobUseCase;
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

    useCase = new DeleteJobUseCase(repositoryMock);
  });

  it('should soft delete job by setting status to closed', async () => {
    const jobId = JobId.generate();
    const existingJob = Job.restore(
      jobId,
      'employer-123',
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
    );

    (repositoryMock.findById as jest.Mock).mockResolvedValue(existingJob);

    const result = await useCase.execute({
      jobId: jobId.value,
      employerId: 'employer-123',
    });

    expect(result.success).toBe(true);
    expect(repositoryMock.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'closed',
      })
    );
  });

  it('should throw error if job not found', async () => {
    (repositoryMock.findById as jest.Mock).mockResolvedValue(null);

    const jobId = JobId.generate();

    await expect(
      useCase.execute({
        jobId: jobId.value,
        employerId: 'employer-123',
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
      })
    ).rejects.toThrow('Forbidden');
  });
});
