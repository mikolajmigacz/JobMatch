import { router } from '@infrastructure/trpc/trpc';
import { EnvConfig } from '@config/env.config';
import { healthRouter } from '@routers/health.router';
import { createJobRouter } from '@routers/job.router';
import { createDynamoDBToolboxClient } from '@infrastructure/index';
import { DynamoDbJobRepository } from '@infrastructure/repositories/job.repository';
import {
  GetAllJobsUseCase,
  GetJobUseCase,
  GetMyJobsUseCase,
  CreateJobUseCase,
  UpdateJobUseCase,
  DeleteJobUseCase,
} from '@application/use-cases';

export const createAppRouter = (config: EnvConfig) => {
  // Infrastructure layer
  const dynamoDb = createDynamoDBToolboxClient(config);
  const jobRepository = new DynamoDbJobRepository(dynamoDb);

  // Application layer - use-cases
  const getAllJobsUseCase = new GetAllJobsUseCase(jobRepository);
  const getJobUseCase = new GetJobUseCase(jobRepository);
  const getMyJobsUseCase = new GetMyJobsUseCase(jobRepository);
  const createJobUseCase = new CreateJobUseCase(jobRepository);
  const updateJobUseCase = new UpdateJobUseCase(jobRepository);
  const deleteJobUseCase = new DeleteJobUseCase(jobRepository);

  // Presentation layer - routers with dependency injection
  const jobRouter = createJobRouter({
    getAllJobsUseCase,
    getJobUseCase,
    getMyJobsUseCase,
    createJobUseCase,
    updateJobUseCase,
    deleteJobUseCase,
  });

  return router({
    health: healthRouter,
    jobs: jobRouter,
  });
};

export type AppRouter = ReturnType<typeof createAppRouter>;
