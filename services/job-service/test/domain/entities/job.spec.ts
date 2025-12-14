import { Job, JobId } from '../../../src/domain';

describe('Job Entity', () => {
  it('should create a job with active status by default', () => {
    const job = Job.create(
      'employer-123',
      'Senior Engineer',
      'Looking for senior developer',
      'San Francisco',
      'full-time',
      ['TypeScript', 'React'],
      'Must have 5+ years of experience',
      'TechCorp',
      80000,
      120000
    );

    expect(job.status).toBe('active');
    expect(job.employerId).toBe('employer-123');
    expect(job.title).toBe('Senior Engineer');
  });

  it('should restore a job with provided status', () => {
    const jobId = JobId.generate();
    const createdAt = new Date('2024-01-01');
    const updatedAt = new Date('2024-01-15');

    const job = Job.restore(
      jobId,
      'employer-123',
      'Product Manager',
      'Growing company',
      'Remote',
      80000,
      120000,
      'full-time',
      ['Leadership', 'Strategy'],
      'PM experience required',
      'StartupXYZ',
      'closed',
      createdAt,
      updatedAt
    );

    expect(job.status).toBe('closed');
    expect(job.jobId.value).toBe(jobId.value);
  });

  it('should convert job to primitive with ISO dates', () => {
    const job = Job.create(
      'employer-123',
      'Developer',
      'Backend role',
      'NYC',
      'part-time',
      ['Node.js'],
      '3+ years experience',
      'Company',
      60000,
      90000
    );

    const primitive = job.toPrimitive();

    expect(primitive.status).toBe('active');
    expect(primitive.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(primitive.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(primitive.title).toBe('Developer');
  });
});
