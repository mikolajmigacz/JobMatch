import { JobClient } from '../../src/infrastructure/clients/job.client';
import { UserClient } from '../../src/infrastructure/clients/user.client';
import { SQSService } from '../../src/infrastructure/services/sqs.service';
import { JobDetails, UserDetails } from '@jobmatch/shared';

export const createMockJobClient = (overrides?: Partial<JobClient>): jest.Mocked<JobClient> => {
  return {
    fetchJobDetails: jest.fn(),
    getJob: jest.fn(),
    ...overrides,
  } as unknown as jest.Mocked<JobClient>;
};

export const createMockUserClient = (overrides?: Partial<UserClient>): jest.Mocked<UserClient> => {
  return {
    getUser: jest.fn(),
    ...overrides,
  } as jest.Mocked<UserClient>;
};

export const createMockSqsService = (overrides?: Partial<SQSService>): jest.Mocked<SQSService> => {
  return {
    publishEvent: jest.fn(),
    ...overrides,
  } as jest.Mocked<SQSService>;
};

export const mockJobDetails = (overrides?: Partial<JobDetails>): JobDetails => ({
  jobId: '550e8400-e29b-41d4-a716-446655440000',
  title: 'Senior Engineer',
  status: 'active',
  employerId: '550e8400-e29b-41d4-a716-446655440001',
  companyName: 'TechCorp',
  ...overrides,
});

export const mockUserDetails = (overrides?: Partial<UserDetails>): UserDetails => ({
  userId: '550e8400-e29b-41d4-a716-446655440002',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  ...overrides,
});
