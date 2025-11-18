import { GetProfileRequestSchema, UpdateProfileRequestSchema } from '@jobmatch/shared';
import { router, publicProcedure } from '@infrastructure/trpc/trpc';
import { UserRepository } from '@domain/repositories/user.repository';
import { GetProfileUseCase } from '@application/use-cases';
import { UpdateProfileUseCase } from '@application/use-cases';

export const createUserRouter = (repository: UserRepository) => {
  const getProfileUseCase = new GetProfileUseCase(repository);
  const updateProfileUseCase = new UpdateProfileUseCase(repository);

  return router({
    getProfile: publicProcedure.input(GetProfileRequestSchema).query(async ({ input }) => {
      return getProfileUseCase.execute(input);
    }),

    updateProfile: publicProcedure.input(UpdateProfileRequestSchema).mutation(async ({ input }) => {
      const { userId, ...updates } = input;
      return updateProfileUseCase.execute({ userId, ...updates });
    }),
  });
};
