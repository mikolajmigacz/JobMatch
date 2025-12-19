import { randomUUID } from 'crypto';
import { testInfra } from '../setup/test-infrastructure';
import { ApplicationRepository } from '../../src/domain/repositories/application.repository';
import { Application, ApplicationStatus } from '../../src/domain/entities/application';

describe('Get Applications for Job Integration Tests', () => {
  let repository: ApplicationRepository;

  beforeAll(async () => {
    await testInfra.initialize();
    const documentClient = testInfra.getDatabase().getDocumentClient();
    repository = new ApplicationRepository(documentClient, 'Applications');
  });

  afterAll(async () => {
    await testInfra.cleanup();
  });

  describe('Get Applications for Job - Success Case', () => {
    it('should retrieve all applications for a job', async () => {
      const seeker1Id = randomUUID();
      const seeker2Id = randomUUID();
      const testJobId = randomUUID();

      // Create multiple applications for same job
      const app1 = Application.create({
        jobId: testJobId,
        jobSeekerId: seeker1Id,
        coverLetter: 'First applicant',
      });

      const app2 = Application.create({
        jobId: testJobId,
        jobSeekerId: seeker2Id,
        coverLetter: 'Second applicant',
      });

      await repository.create(app1);
      await repository.create(app2);

      // Retrieve applications for job
      const applications = await repository.getByJobId(testJobId);

      expect(applications).toHaveLength(2);
      expect(applications.every((app) => app.jobId === testJobId)).toBe(true);
      // Check both seekers are present (order not guaranteed in DynamoDB)
      const seekerIds = new Set(applications.map((app) => app.jobSeekerId));
      expect(seekerIds.has(seeker1Id)).toBe(true);
      expect(seekerIds.has(seeker2Id)).toBe(true);
    });
  });

  describe('Get Applications for Job - Empty List', () => {
    it('should return empty array when job has no applications', async () => {
      const nonExistentJobId = randomUUID();
      const applications = await repository.getByJobId(nonExistentJobId);

      expect(applications).toEqual([]);
    });
  });

  describe('Get Applications for Job - Multiple Applications', () => {
    it('should retrieve multiple applications for the same job with different statuses', async () => {
      const testJobId = randomUUID();
      const seekerId1 = randomUUID();
      const seekerId2 = randomUUID();
      const seekerId3 = randomUUID();

      // Create applications with different statuses
      const app1 = Application.create({
        jobId: testJobId,
        jobSeekerId: seekerId1,
      });

      const app2 = Application.create({
        jobId: testJobId,
        jobSeekerId: seekerId2,
      });

      const app3 = Application.create({
        jobId: testJobId,
        jobSeekerId: seekerId3,
      });

      await repository.create(app1);
      await repository.create(app2);
      await repository.create(app3);

      // Accept one, reject one, leave one pending
      await repository.update(app1.applicationId, {
        status: ApplicationStatus.ACCEPTED,
      });

      await repository.update(app2.applicationId, {
        status: ApplicationStatus.REJECTED,
      });

      // Retrieve all applications for job
      const applications = await repository.getByJobId(testJobId);

      expect(applications).toHaveLength(3);
      const accepted = applications.find((app) => app.status === ApplicationStatus.ACCEPTED);
      const rejected = applications.find((app) => app.status === ApplicationStatus.REJECTED);
      const pending = applications.find((app) => app.status === ApplicationStatus.PENDING);

      expect(accepted?.jobSeekerId).toBe(seekerId1);
      expect(rejected?.jobSeekerId).toBe(seekerId2);
      expect(pending?.jobSeekerId).toBe(seekerId3);
    });
  });

  describe('Get Applications for Job - Isolation', () => {
    it('should only return applications for the specified job', async () => {
      const jobId1 = randomUUID();
      const jobId2 = randomUUID();
      const seekerId = randomUUID();

      // Create applications for two different jobs
      const app1 = Application.create({
        jobId: jobId1,
        jobSeekerId: seekerId,
      });

      const app2 = Application.create({
        jobId: jobId2,
        jobSeekerId: seekerId,
      });

      await repository.create(app1);
      await repository.create(app2);

      // Get applications for job1
      const jobApps = await repository.getByJobId(jobId1);

      // Should only contain app1
      expect(jobApps).toHaveLength(1);
      expect(jobApps[0].jobId).toBe(jobId1);
      expect(jobApps[0].applicationId).toBe(app1.applicationId);
    });
  });
});
