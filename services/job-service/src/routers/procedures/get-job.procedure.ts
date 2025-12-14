import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { publicProcedure } from '@infrastructure/trpc/trpc';
import { GetJobUseCase } from '@application/use-cases';

export function createGetJobProcedure(getJobUseCase: GetJobUseCase) {
  return publicProcedure.input(z.object({ jobId: z.string().uuid() })).query(async ({ input }) => {
    try {
      const job = await getJobUseCase.execute(input);

      if (!job) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Job not found',
        });
      }

      return job;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      console.error('Error getting job:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch job',
      });
    }
  });
}
