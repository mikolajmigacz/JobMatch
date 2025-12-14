import { TRPCError } from '@trpc/server';
import { employerProcedure } from '@infrastructure/trpc/trpc';
import { GetMyJobsFilterSchema } from '@jobmatch/shared';
import { GetMyJobsUseCase } from '@application/use-cases';

export function createGetMyJobsProcedure(getMyJobsUseCase: GetMyJobsUseCase) {
  return employerProcedure.input(GetMyJobsFilterSchema).query(async ({ ctx, input }) => {
    try {
      return await getMyJobsUseCase.execute({
        ...input,
        employerId: ctx.userId,
      });
    } catch (error) {
      console.error('Error getting my jobs:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch your jobs',
      });
    }
  });
}
