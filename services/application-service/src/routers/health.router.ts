import { router, publicProcedure } from '@infrastructure/trpc/trpc';

export const healthRouter = router({
  check: publicProcedure.query(() => ({
    status: 'ok',
    service: 'application-service',
    timestamp: new Date().toISOString(),
  })),
});
