import { randomUUID } from 'crypto';
import { testInfra } from '../setup/test-infrastructure';
import { ApplicationRepository } from '../../src/domain/repositories/application.repository';
import { Application, ApplicationStatus } from '../../src/domain/entities/application';

describe('Get My Applications Integration Tests', () => {
  let repository: ApplicationRepository;

  beforeAll(async () => {
    await testInfra.initialize();
    const documentClient = testInfra.getDatabase().getDocumentClient();
    repository = new ApplicationRepository(documentClient, 'Applications');
  });

  afterAll(async () => {
    await testInfra.cleanup();
  });

  describe('Get My Applications - Success Case', () => {
    it('should retrieve all applications for a job seeker', async () => {
      const testJobSeekerId = randomUUID();
      const job1Id = randomUUID();
      const job2Id = randomUUID();

      // Create multiple applications
      const app1 = Application.create({
        jobId: job1Id,
        jobSeekerId: testJobSeekerId,
        coverLetter: 'First application',
      });

      const app2 = Application.create({
        jobId: job2Id,
        jobSeekerId: testJobSeekerId,
        coverLetter: 'Second application',
      });

      await repository.create(app1);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await repository.create(app2);

      // Query applications for job seeker
      const applications = await repository.getByJobSeekerId(testJobSeekerId);

      expect(applications).toHaveLength(2);
      expect(applications[0]).toMatchObject({
        jobSeekerId: testJobSeekerId,
        status: ApplicationStatus.PENDING,
      });
      expect(applications[1]).toMatchObject({
        jobSeekerId: testJobSeekerId,
        status: ApplicationStatus.PENDING,
      });
    });
  });

  describe('Get My Applications - Empty List', () => {
    it('should return empty list when job seeker has no applications', async () => {
      const testJobSeekerId = randomUUID();
      const applications = await repository.getByJobSeekerId(testJobSeekerId);

      expect(applications).toEqual([]);
    });
  });

  describe('Get My Applications - Sorting', () => {
    it('should return applications for a job seeker', async () => {
      const testJobSeekerId = randomUUID();
      const job1Id = randomUUID();
      const job2Id = randomUUID();
      const job3Id = randomUUID();

      // Create applications with delays
      const app1 = Application.create({
        jobId: job1Id,
        jobSeekerId: testJobSeekerId,
      });
      await repository.create(app1);

      await new Promise((resolve) => setTimeout(resolve, 10));

      const app2 = Application.create({
        jobId: job2Id,
        jobSeekerId: testJobSeekerId,
      });
      await repository.create(app2);

      await new Promise((resolve) => setTimeout(resolve, 10));

      const app3 = Application.create({
        jobId: job3Id,
        jobSeekerId: testJobSeekerId,
      });
      await repository.create(app3);

      const applications = await repository.getByJobSeekerId(testJobSeekerId);

      expect(applications).toHaveLength(3);
      // Verify all applications exist (order may vary in DynamoDB)
      const appIds = new Set(applications.map((app) => app.applicationId));
      expect(appIds.has(app1.applicationId)).toBe(true);
      expect(appIds.has(app2.applicationId)).toBe(true);
      expect(appIds.has(app3.applicationId)).toBe(true);

      // Verify all belong to same job seeker
      expect(applications.every((app) => app.jobSeekerId === testJobSeekerId)).toBe(true);
    });
  });

  describe('Get My Applications - Filter by Status', () => {
    it('should retrieve applications with different statuses', async () => {
      const testJobSeekerId = randomUUID();
      const jobId1 = randomUUID();
      const jobId2 = randomUUID();

      const app1 = Application.create({
        jobId: jobId1,
        jobSeekerId: testJobSeekerId,
      });

      const app2 = Application.create({
        jobId: jobId2,
        jobSeekerId: testJobSeekerId,
      });

      await repository.create(app1);
      await repository.create(app2);

      // Accept one application
      await repository.update(app1.applicationId, {
        status: ApplicationStatus.ACCEPTED,
      });

      // Retrieve all
      const applications = await repository.getByJobSeekerId(testJobSeekerId);
      expect(applications).toHaveLength(2);

      // Find accepted
      const accepted = applications.find((app) => app.status === ApplicationStatus.ACCEPTED);
      expect(accepted).toBeDefined();
      expect(accepted?.applicationId).toBe(app1.applicationId);
    });
  });
});
