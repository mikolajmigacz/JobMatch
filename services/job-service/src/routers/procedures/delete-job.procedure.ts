import { TRPCError } from '@trpc/server';
import { employerProcedure } from '@infrastructure/trpc/trpc';
import { DeleteJobRequestSchema } from '@jobmatch/shared';
import { DeleteJobUseCase } from '@application/use-cases';

export function createDeleteJobProcedure(deleteJobUseCase: DeleteJobUseCase) {
  return employerProcedure.input(DeleteJobRequestSchema).mutation(async ({ ctx, input }) => {
    try {
      return await deleteJobUseCase.execute({
        ...input,
        employerId: ctx.userId,
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete job',
      });
    }
  });
}
