import { protectedProcedure } from '@infrastructure/trpc/trpc';
import { GetProfileRequestSchema } from '@jobmatch/shared';
import { GetProfileUseCase } from '@application/use-cases';

export function createGetProfileProcedure(getProfileUseCase: GetProfileUseCase) {
  return protectedProcedure.input(GetProfileRequestSchema).query(async ({ input }) => {
    return getProfileUseCase.execute(input);
  });
}
