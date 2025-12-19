import { randomUUID } from 'crypto';
import { JobDetails, UserDetails } from '@jobmatch/shared';

export const testFixtures = {
  jobSeekerId: () => randomUUID(),
  employerId: () => randomUUID(),
  jobId: () => randomUUID(),
  applicationId: () => randomUUID(),

  validJob: (overrides?: Record<string, unknown>) => ({
    jobId: randomUUID(),
    title: 'Senior Engineer',
    status: 'active' as const,
    employerId: randomUUID(),
    companyName: 'TechCorp',
    ...overrides,
  }),

  validApplication: (overrides?: Record<string, unknown>) => ({
    applicationId: randomUUID(),
    jobId: randomUUID(),
    jobSeekerId: randomUUID(),
    status: 'pending' as const,
    coverLetter: 'I am interested in this position',
    cvUrl: 'https://example.com/cv.pdf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),

  validUser: (overrides?: Record<string, unknown>) => ({
    userId: randomUUID(),
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    ...overrides,
  }),

  applyToJobInput: (overrides?: Record<string, unknown>) => ({
    jobId: randomUUID(),
    coverLetter: 'I am very interested in this position',
    cvUrl: 'https://example.com/cv.pdf',
    ...overrides,
  }),
};

export const mockJobDetails = (overrides?: Partial<JobDetails>): JobDetails => ({
  jobId: randomUUID(),
  title: 'Senior Engineer',
  status: 'active',
  employerId: randomUUID(),
  companyName: 'TechCorp',
  ...overrides,
});

export const mockUserDetails = (overrides?: Partial<UserDetails>): UserDetails => ({
  userId: randomUUID(),
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  ...overrides,
});
