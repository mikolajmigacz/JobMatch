import { TRPCError } from '@trpc/server';
import { employerProcedure } from '@infrastructure/trpc/trpc';
import { UpdateJobRequestSchema } from '@jobmatch/shared';
import { UpdateJobUseCase } from '@application/use-cases';

export function createUpdateJobProcedure(updateJobUseCase: UpdateJobUseCase) {
  return employerProcedure.input(UpdateJobRequestSchema).mutation(async ({ ctx, input }) => {
    try {
      return await updateJobUseCase.execute({
        ...input,
        employerId: ctx.userId,
      });
    } catch (error) {
      console.error('Error updating job:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update job',
      });
    }
  });
}
