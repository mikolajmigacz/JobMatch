import { randomUUID } from 'crypto';
import { testInfra } from '../setup/test-infrastructure';
import { DynamoDbJobRepository } from '../../src/infrastructure/repositories/job.repository';
import { UpdateJobUseCase, CreateJobUseCase } from '../../src/application/use-cases';

describe('UpdateJob Integration Tests', () => {
  let repository: DynamoDbJobRepository;
  let createJobUseCase: CreateJobUseCase;
  let updateJobUseCase: UpdateJobUseCase;

  beforeAll(async () => {
    await testInfra.initialize();
    const documentClient = testInfra.getDatabase().getDocumentClient();
    repository = new DynamoDbJobRepository(documentClient);
    createJobUseCase = new CreateJobUseCase(repository);
    updateJobUseCase = new UpdateJobUseCase(repository);
  });

  afterAll(async () => {
    await testInfra.cleanup();
  });

  describe('UpdateJobUseCase', () => {
    it('should update job title and description', async () => {
      const employerId = randomUUID();

      const created = await createJobUseCase.execute({
        employerId,
        title: 'Original Title',
        description: 'Original Description',
        location: 'NYC',
        employmentType: 'full-time',
        skills: ['TypeScript'],
        requirements: 'Experience',
        companyName: 'Company',
      });

      const updated = await updateJobUseCase.execute({
        jobId: created.jobId,
        employerId,
        title: 'Updated Title',
        description: 'Updated Description',
      });

      expect(updated.title).toBe('Updated Title');
      expect(updated.description).toBe('Updated Description');
      expect(updated.jobId).toBe(created.jobId);
    });

    it('should preserve unchanged fields during update', async () => {
      const employerId = randomUUID();

      const created = await createJobUseCase.execute({
        employerId,
        title: 'Job Title',
        description: 'Full Description',
        location: 'Remote',
        employmentType: 'part-time',
        skills: ['Node.js', 'React'],
        requirements: 'Experience required',
        companyName: 'MyCompany',
        salaryMin: 70000,
        salaryMax: 100000,
      });

      const updated = await updateJobUseCase.execute({
        jobId: created.jobId,
        employerId,
        title: 'New Title',
      });

      expect(updated.location).toBe('Remote');
      expect(updated.employmentType).toBe('part-time');
      expect(updated.skills).toEqual(['Node.js', 'React']);
      expect(updated.salaryMin).toBe(70000);
    });

    it('should reject update if not job owner', async () => {
      const employerId = randomUUID();
      const otherEmployerId = randomUUID();

      const created = await createJobUseCase.execute({
        employerId,
        title: 'Job Title',
        description: 'Description',
        location: 'NYC',
        employmentType: 'full-time',
        skills: ['TypeScript'],
        requirements: 'Experience',
        companyName: 'Company',
      });

      await expect(
        updateJobUseCase.execute({
          jobId: created.jobId,
          employerId: otherEmployerId,
          title: 'Hacked Title',
        })
      ).rejects.toThrow('Forbidden');
    });
  });
});
