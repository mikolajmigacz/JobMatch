import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProxyErrorHandler } from './interceptors/error-handler.interceptor';
import { AuthServiceClient } from './clients/auth-service.client';
import { UserServiceClient } from './clients/user-service.client';
import { JobServiceClient } from './clients/job-service.client';
import { ApplicationServiceClient } from './clients/application-service.client';
import { EmailServiceClient } from './clients/email-service.client';
import { CvAnalysisServiceClient } from './clients/cv-analysis-service.client';
import { SERVICES_CONFIG } from './config/services.config';
import { createProxyController } from './core/proxy-controller.factory';
import { AuthProxyController } from './controllers/auth-proxy.controller';
import { CvAnalysisProxyController } from './controllers/cv-analysis-proxy.controller';
import { REST_SERVICES } from './config/service.constants';

const clientMapping: Record<
  string,
  | typeof AuthServiceClient
  | typeof UserServiceClient
  | typeof JobServiceClient
  | typeof ApplicationServiceClient
  | typeof EmailServiceClient
  | typeof CvAnalysisServiceClient
> = {
  auth: AuthServiceClient,
  user: UserServiceClient,
  job: JobServiceClient,
  application: ApplicationServiceClient,
  'cv-analysis': CvAnalysisServiceClient,
};

const genericControllers = SERVICES_CONFIG.filter(
  (config) => !REST_SERVICES.includes(config.name as 'auth' | 'cvAnalysis')
).map((config) =>
  createProxyController(config, clientMapping[config.name] as typeof AuthServiceClient)
);

const clients = [
  AuthServiceClient,
  UserServiceClient,
  JobServiceClient,
  ApplicationServiceClient,
  EmailServiceClient,
  CvAnalysisServiceClient,
];

@Module({
  imports: [HttpModule],
  controllers: [...genericControllers, AuthProxyController, CvAnalysisProxyController],
  providers: [ProxyErrorHandler, ...clients],
  exports: clients,
})
export class ProxyModule {}
