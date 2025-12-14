import { router } from '@infrastructure/trpc/trpc';
import { EnvConfig } from '@config/env.config';
import { healthRouter } from '@routers/health.router';

export const createAppRouter = (config: EnvConfig) => {
  return router({
    health: healthRouter,
  });
};

export type AppRouter = ReturnType<typeof createAppRouter>;
