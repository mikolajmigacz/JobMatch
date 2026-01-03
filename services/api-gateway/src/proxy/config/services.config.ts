export interface ServiceConfig {
  name: string;
  route: string;
  clientToken: symbol;
  pathPrefix?: string;
}

export const SERVICES_CONFIG: ServiceConfig[] = [
  {
    name: 'auth',
    route: 'api/auth',
    clientToken: Symbol('AUTH_CLIENT'),
    pathPrefix: '/auth',
  },
  {
    name: 'user',
    route: 'api/users',
    clientToken: Symbol('USER_CLIENT'),
  },
  {
    name: 'job',
    route: 'api/jobs',
    clientToken: Symbol('JOB_CLIENT'),
  },
  {
    name: 'application',
    route: 'api/applications',
    clientToken: Symbol('APPLICATION_CLIENT'),
  },
  {
    name: 'cv-analysis',
    route: 'api/cv-analysis',
    clientToken: Symbol('CV_ANALYSIS_CLIENT'),
  },
];
