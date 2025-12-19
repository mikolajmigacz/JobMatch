import { router } from '@infrastructure/trpc/trpc';
import { healthRouter } from './health.router';
import { createApplicationRouter } from './application.router';
import { ApplicationRepository } from '@domain/repositories/application.repository';
import { SQSService } from '@infrastructure/services/sqs.service';
import { JobClient, UserClient } from '@infrastructure/clients';
import { EnvConfig } from '@config/env.config';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { SQSClient } from '@aws-sdk/client-sqs';

export function createAppRouter(
  documentClient: DynamoDBDocumentClient,
  sqsClient: SQSClient,
  config: EnvConfig
) {
  const applicationRepository = new ApplicationRepository(
    documentClient,
    config.DYNAMODB_TABLE_APPLICATIONS
  );
  const sqsService = new SQSService(sqsClient, config.SQS_QUEUE_URL);
  const jobClient = new JobClient(config.JOB_SERVICE_URL);
  const userClient = new UserClient(config.USER_SERVICE_URL);

  const applicationRouter = createApplicationRouter({
    applicationRepository,
    sqsService,
    jobClient,
    userClient,
  });

  return router({
    health: healthRouter,
    applications: applicationRouter,
  });
}

export type AppRouter = ReturnType<typeof createAppRouter>;
