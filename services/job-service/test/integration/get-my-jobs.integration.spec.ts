import { randomUUID } from 'crypto';
import { testInfra } from '../setup/test-infrastructure';
import { DynamoDbJobRepository } from '../../src/infrastructure/repositories/job.repository';
import { GetMyJobsUseCase, CreateJobUseCase } from '../../src/application/use-cases';

describe('GetMyJobs Integration Tests', () => {
  let repository: DynamoDbJobRepository;
  let createJobUseCase: CreateJobUseCase;
  let getMyJobsUseCase: GetMyJobsUseCase;

  beforeAll(async () => {
    await testInfra.initialize();
    const documentClient = testInfra.getDatabase().getDocumentClient();
    repository = new DynamoDbJobRepository(documentClient);
    createJobUseCase = new CreateJobUseCase(repository);
    getMyJobsUseCase = new GetMyJobsUseCase(repository);
  });

  afterAll(async () => {
    await testInfra.cleanup();
  });

  describe('GetMyJobsUseCase', () => {
    it('should retrieve only jobs created by the employer', async () => {
      const employerId = randomUUID();
      const otherEmployerId = randomUUID();

      // Create jobs for current employer
      await createJobUseCase.execute({
        employerId,
        title: 'My First Job',
        description: 'My first posting',
        location: 'NYC',
        employmentType: 'full-time',
        skills: ['TypeScript'],
        requirements: 'Experience required',
        companyName: 'MyCompany',
      });

      // Create job for other employer
      await createJobUseCase.execute({
        employerId: otherEmployerId,
        title: 'Other Job',
        description: 'Other posting',
        location: 'LA',
        employmentType: 'part-time',
        skills: ['JavaScript'],
        requirements: 'Some experience',
        companyName: 'OtherCompany',
      });

      const myJobs = await getMyJobsUseCase.execute({
        employerId,
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(myJobs.data.length).toBeGreaterThanOrEqual(1);
      expect(myJobs.data.every((job) => job.employerId === employerId)).toBe(true);
    });

    it('should filter my jobs by title', async () => {
      const employerId = randomUUID();

      await createJobUseCase.execute({
        employerId,
        title: 'Senior TypeScript Developer',
        description: 'Description',
        location: 'Remote',
        employmentType: 'full-time',
        skills: ['TypeScript'],
        requirements: 'Requirements',
        companyName: 'Company',
      });

      await createJobUseCase.execute({
        employerId,
        title: 'Designer Position',
        description: 'Description',
        location: 'Remote',
        employmentType: 'full-time',
        skills: ['Design'],
        requirements: 'Requirements',
        companyName: 'Company',
      });

      const filtered = await getMyJobsUseCase.execute({
        employerId,
        title: 'TypeScript',
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(filtered.data.every((job) => job.title.includes('TypeScript'))).toBe(true);
    });

    it('should include all job statuses for employer', async () => {
      const employerId = randomUUID();

      const job = await createJobUseCase.execute({
        employerId,
        title: 'Test Job',
        description: 'For status check',
        location: 'Remote',
        employmentType: 'full-time',
        skills: ['Testing'],
        requirements: 'Experience',
        companyName: 'TestCorp',
      });

      const myJobs = await getMyJobsUseCase.execute({
        employerId,
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(myJobs.data).toContainEqual(expect.objectContaining({ jobId: job.jobId }));
    });
  });
});
