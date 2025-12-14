import { protectedProcedure } from '@infrastructure/trpc/trpc';
import { UpdateProfileRequestSchema } from '@jobmatch/shared';
import { UpdateProfileUseCase } from '@application/use-cases';

export function createUpdateProfileProcedure(updateProfileUseCase: UpdateProfileUseCase) {
  return protectedProcedure.input(UpdateProfileRequestSchema).mutation(async ({ input }) => {
    const { userId, ...updates } = input;
    return updateProfileUseCase.execute({ userId, ...updates });
  });
}
