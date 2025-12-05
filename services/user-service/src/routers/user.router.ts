import {
  GetProfileRequestSchema,
  UpdateProfileRequestSchema,
  UploadLogoRequestSchema,
  DeleteUserRequestSchema,
} from '@jobmatch/shared';
import { router, protectedProcedure, employerProcedure } from '@infrastructure/trpc/trpc';
import { UserRepository } from '@domain/repositories/user.repository';
import {
  GetProfileUseCase,
  UpdateProfileUseCase,
  UploadLogoUseCase,
  DeleteUserUseCase,
} from '@application/use-cases';

export const createUserRouter = (repository: UserRepository) => {
  const getProfileUseCase = new GetProfileUseCase(repository);
  const updateProfileUseCase = new UpdateProfileUseCase(repository);
  const uploadLogoUseCase = new UploadLogoUseCase(repository);
  const deleteUserUseCase = new DeleteUserUseCase(repository);

  return router({
    getUser: protectedProcedure.input(GetProfileRequestSchema).query(async ({ input }) => {
      return getProfileUseCase.execute(input);
    }),

    updateUser: protectedProcedure.input(UpdateProfileRequestSchema).mutation(async ({ input }) => {
      const { userId, ...updates } = input;
      return updateProfileUseCase.execute({ userId, ...updates });
    }),

    uploadLogo: employerProcedure.input(UploadLogoRequestSchema).mutation(async ({ input }) => {
      return uploadLogoUseCase.execute(input);
    }),

    deleteUser: protectedProcedure.input(DeleteUserRequestSchema).mutation(async ({ input }) => {
      return deleteUserUseCase.execute(input);
    }),
  });
};
