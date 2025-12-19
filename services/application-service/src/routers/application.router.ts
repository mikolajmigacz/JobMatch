import { router } from '@infrastructure/trpc/trpc';
import { ApplicationRepository } from '@domain/repositories/application.repository';
import { SQSService } from '@infrastructure/services/sqs.service';
import { JobClient, UserClient } from '@infrastructure/clients';
import {
  createGetMyApplicationsProcedure,
  createGetApplicationsForJobProcedure,
  createApplyToJobProcedure,
  createAcceptApplicationProcedure,
  createRejectApplicationProcedure,
} from './procedures';

export interface ApplicationRouterDependencies {
  applicationRepository: ApplicationRepository;
  sqsService: SQSService;
  jobClient: JobClient;
  userClient: UserClient;
}

export function createApplicationRouter(dependencies: ApplicationRouterDependencies) {
  const { applicationRepository, sqsService, jobClient, userClient } = dependencies;

  return router({
    getMyApplications: createGetMyApplicationsProcedure(applicationRepository, jobClient),
    getApplicationsForJob: createGetApplicationsForJobProcedure(
      applicationRepository,
      jobClient,
      userClient
    ),
    applyToJob: createApplyToJobProcedure(applicationRepository, sqsService, jobClient, userClient),
    acceptApplication: createAcceptApplicationProcedure(
      applicationRepository,
      sqsService,
      jobClient,
      userClient
    ),
    rejectApplication: createRejectApplicationProcedure(
      applicationRepository,
      sqsService,
      jobClient,
      userClient
    ),
  });
}

export type ApplicationRouter = ReturnType<typeof createApplicationRouter>;
