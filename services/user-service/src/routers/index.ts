import { router } from '@infrastructure/trpc/trpc';
import { UserRepository } from '@domain/repositories/user.repository';
import { healthRouter } from '@routers/health.router';
import { createUserRouter } from '@routers/user.router';

export const createAppRouter = (userRepository: UserRepository) => {
  return router({
    health: healthRouter,
    user: createUserRouter(userRepository),
  });
};

export type AppRouter = ReturnType<typeof createAppRouter>;
