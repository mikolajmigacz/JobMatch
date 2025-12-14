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
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Job not found',
          });
        }
        if (error.message.includes('Forbidden')) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You can only delete your own jobs',
          });
        }
      }
      console.error('Error deleting job:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete job',
      });
    }
  });
}
