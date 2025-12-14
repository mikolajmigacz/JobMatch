import { randomUUID } from 'crypto';
import { testInfra } from '../setup/test-infrastructure';
import { DynamoDbJobRepository } from '../../src/infrastructure/repositories/job.repository';
import { DeleteJobUseCase, CreateJobUseCase, GetJobUseCase } from '../../src/application/use-cases';

describe('DeleteJob Integration Tests', () => {
  let repository: DynamoDbJobRepository;
  let createJobUseCase: CreateJobUseCase;
  let deleteJobUseCase: DeleteJobUseCase;
  let getJobUseCase: GetJobUseCase;

  beforeAll(async () => {
    await testInfra.initialize();
    const documentClient = testInfra.getDatabase().getDocumentClient();
    repository = new DynamoDbJobRepository(documentClient);
    createJobUseCase = new CreateJobUseCase(repository);
    deleteJobUseCase = new DeleteJobUseCase(repository);
    getJobUseCase = new GetJobUseCase(repository);
  });

  afterAll(async () => {
    await testInfra.cleanup();
  });

  describe('DeleteJobUseCase', () => {
    it('should soft delete job by setting status to closed', async () => {
      const employerId = randomUUID();

      const created = await createJobUseCase.execute({
        employerId,
        title: 'Job to Close',
        description: 'Will be closed',
        location: 'NYC',
        employmentType: 'full-time',
        skills: ['TypeScript'],
        requirements: 'Experience',
        companyName: 'Company',
      });

      expect(created.status).toBe('active');

      const deleted = await deleteJobUseCase.execute({
        jobId: created.jobId,
        employerId,
      });

      expect(deleted.success).toBe(true);

      // Verify job is now closed
      const closed = await getJobUseCase.execute({ jobId: created.jobId });
      expect(closed?.status).toBe('closed');
    });

    it('should reject deletion if not job owner', async () => {
      const employerId = randomUUID();
      const otherEmployerId = randomUUID();

      const created = await createJobUseCase.execute({
        employerId,
        title: 'Protected Job',
        description: 'Cannot be deleted by others',
        location: 'Remote',
        employmentType: 'part-time',
        skills: ['Node.js'],
        requirements: 'Experience',
        companyName: 'Company',
      });

      await expect(
        deleteJobUseCase.execute({
          jobId: created.jobId,
          employerId: otherEmployerId,
        })
      ).rejects.toThrow('Forbidden');

      // Verify job is still active
      const job = await getJobUseCase.execute({ jobId: created.jobId });
      expect(job?.status).toBe('active');
    });

    it('should return success message with job ID', async () => {
      const employerId = randomUUID();

      const created = await createJobUseCase.execute({
        employerId,
        title: 'Job to Delete',
        description: 'Test deletion response',
        location: 'LA',
        employmentType: 'contract',
        skills: ['JavaScript'],
        requirements: 'Skills required',
        companyName: 'Company',
      });

      const result = await deleteJobUseCase.execute({
        jobId: created.jobId,
        employerId,
      });

      expect(result).toMatchObject({
        success: true,
        jobId: created.jobId,
      });
    });
  });
});
