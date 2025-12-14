import { TRPCError } from '@trpc/server';
import { employerProcedure } from '@infrastructure/trpc/trpc';
import { CreateJobDtoSchema } from '@jobmatch/shared';
import { CreateJobUseCase } from '@application/use-cases';

export function createCreateJobProcedure(createJobUseCase: CreateJobUseCase) {
  return employerProcedure.input(CreateJobDtoSchema).mutation(async ({ ctx, input }) => {
    try {
      return await createJobUseCase.execute({
        ...input,
        employerId: ctx.userId,
      });
    } catch (error) {
      console.error('Error creating job:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create job',
      });
    }
  });
}
