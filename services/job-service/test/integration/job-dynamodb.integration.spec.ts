import { randomUUID } from 'crypto';
import { testInfra } from '../setup/test-infrastructure';
import { DynamoDbJobRepository } from '../../src/infrastructure/repositories/job.repository';
import {
  CreateJobUseCase,
  GetJobUseCase,
  GetAllJobsUseCase,
} from '../../src/application/use-cases';

describe('Job Service Integration Tests - DynamoDB', () => {
  let repository: DynamoDbJobRepository;
  let createJobUseCase: CreateJobUseCase;
  let getJobUseCase: GetJobUseCase;
  let getAllJobsUseCase: GetAllJobsUseCase;

  beforeAll(async () => {
    await testInfra.initialize();
    const documentClient = testInfra.getDatabase().getDocumentClient();
    repository = new DynamoDbJobRepository(documentClient);
    createJobUseCase = new CreateJobUseCase(repository);
    getJobUseCase = new GetJobUseCase(repository);
    getAllJobsUseCase = new GetAllJobsUseCase(repository);
  });

  afterAll(async () => {
    await testInfra.cleanup();
  });

  describe('DynamoDbJobRepository - Job Operations', () => {
    it('should create and retrieve a job by ID', async () => {
      const employerId = randomUUID();
      const jobResponse = await createJobUseCase.execute({
        employerId,
        title: 'Senior Engineer',
        description: 'Looking for senior developer',
        location: 'San Francisco',
        employmentType: 'full-time',
        skills: ['TypeScript', 'React'],
        requirements: 'Must have 5+ years of experience',
        companyName: 'TechCorp',
        salaryMin: 80000,
        salaryMax: 120000,
      });

      expect(jobResponse).toMatchObject({
        jobId: expect.any(String),
        employerId,
        title: 'Senior Engineer',
        status: 'active',
      });

      const retrieved = await getJobUseCase.execute({ jobId: jobResponse.jobId });
      expect(retrieved).toEqual(jobResponse);
    });

    it('should retrieve all active jobs with filtering', async () => {
      const employerId = randomUUID();

      // Create multiple jobs
      await createJobUseCase.execute({
        employerId,
        title: 'Frontend Developer',
        description: 'React specialist needed',
        location: 'New York',
        employmentType: 'full-time',
        skills: ['React', 'JavaScript'],
        requirements: '3+ years experience',
        companyName: 'WebCorp',
        salaryMin: 70000,
        salaryMax: 110000,
      });

      await createJobUseCase.execute({
        employerId,
        title: 'Backend Developer',
        description: 'Node.js specialist needed',
        location: 'Remote',
        employmentType: 'part-time',
        skills: ['Node.js', 'TypeScript'],
        requirements: '4+ years experience',
        companyName: 'ApiCorp',
        salaryMin: 60000,
        salaryMax: 100000,
      });

      const allJobs = await getAllJobsUseCase.execute({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(allJobs.data.length).toBeGreaterThanOrEqual(2);
      expect(allJobs.data.every((job) => job.status === 'active')).toBe(true);
    });

    it('should filter jobs by location and employment type', async () => {
      const employerId = randomUUID();

      await createJobUseCase.execute({
        employerId,
        title: 'Junior Developer',
        description: 'Internship role',
        location: 'Los Angeles',
        employmentType: 'internship',
        skills: ['JavaScript'],
        requirements: 'Recent graduate',
        companyName: 'StartupLA',
        salaryMin: 30000,
        salaryMax: 50000,
      });

      const filtered = await getAllJobsUseCase.execute({
        location: 'Los Angeles',
        employmentType: ['internship'],
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(filtered.data.length).toBeGreaterThan(0);
      expect(filtered.data.every((job) => job.location.includes('Los Angeles'))).toBe(true);
    });
  });
});
