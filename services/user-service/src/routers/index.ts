import { router } from '@infrastructure/trpc/trpc';
import { UserRepository } from '@domain/repositories/user.repository';
import { EnvConfig } from '@config/env.config';
import { healthRouter } from '@routers/health.router';
import { createUserRouter } from '@routers/user.router';

export const createAppRouter = (userRepository: UserRepository, config: EnvConfig) => {
  return router({
    health: healthRouter,
    user: createUserRouter(userRepository, config),
  });
};

export type AppRouter = ReturnType<typeof createAppRouter>;
export type UserRouter = ReturnType<typeof createUserRouter>;
