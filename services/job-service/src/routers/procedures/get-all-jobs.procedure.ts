import { TRPCError } from '@trpc/server';
import { publicProcedure } from '@infrastructure/trpc/trpc';
import { JobFilterSchema } from '@jobmatch/shared';
import { GetAllJobsUseCase } from '@application/use-cases';

export function createGetAllJobsProcedure(getAllJobsUseCase: GetAllJobsUseCase) {
  return publicProcedure.input(JobFilterSchema).query(async ({ input }) => {
    try {
      return await getAllJobsUseCase.execute(input);
    } catch (error) {
      console.error('Error getting all jobs:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch jobs',
      });
    }
  });
}
