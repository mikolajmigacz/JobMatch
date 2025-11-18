import { publicProcedure, router } from '@infrastructure/trpc/trpc';

export const healthRouter = router({
  check: publicProcedure.query(async () => {
    return {
      status: 'ok',
      service: 'user-service',
      timestamp: new Date().toISOString(),
    };
  }),
});
