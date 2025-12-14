import { TRPCError } from '@trpc/server';
import { protectedProcedure } from '@infrastructure/trpc/trpc';
import { DeleteUserRequestSchema } from '@jobmatch/shared';
import { DeleteUserUseCase } from '@application/use-cases';

export function createDeleteUserProcedure(deleteUserUseCase: DeleteUserUseCase) {
  return protectedProcedure.input(DeleteUserRequestSchema).mutation(async ({ input, ctx }) => {
    if (ctx.userId !== input.userId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Unauthorized: Can only delete own account',
      });
    }
    return deleteUserUseCase.execute(input);
  });
}
