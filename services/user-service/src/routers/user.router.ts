import {
  GetProfileRequestSchema,
  UpdateProfileRequestSchema,
  DeleteUserRequestSchema,
  UploadLogoRequestSchema,
  UserRoleSchema,
} from '@jobmatch/shared';
import { router, protectedProcedure } from '@infrastructure/trpc/trpc';
import { UserRepository } from '@domain/repositories/user.repository';
import { EnvConfig } from '@config/env.config';
import {
  GetProfileUseCase,
  UpdateProfileUseCase,
  DeleteUserUseCase,
  UploadLogoUseCase,
} from '@application/use-cases';
import { S3FileStorageService } from '@infrastructure/services/s3-file-storage.service';

export const createUserRouter = (repository: UserRepository, config: EnvConfig) => {
  const getProfileUseCase = new GetProfileUseCase(repository);
  const updateProfileUseCase = new UpdateProfileUseCase(repository);
  const deleteUserUseCase = new DeleteUserUseCase(repository);
  const s3Service = new S3FileStorageService(config);
  const uploadLogoUseCase = new UploadLogoUseCase(repository, s3Service);

  return router({
    getUser: protectedProcedure.input(GetProfileRequestSchema).query(async ({ input }) => {
      return getProfileUseCase.execute(input);
    }),

    updateUser: protectedProcedure.input(UpdateProfileRequestSchema).mutation(async ({ input }) => {
      const { userId, ...updates } = input;
      return updateProfileUseCase.execute({ userId, ...updates });
    }),

    deleteUser: protectedProcedure.input(DeleteUserRequestSchema).mutation(async ({ input }) => {
      return deleteUserUseCase.execute(input);
    }),

    uploadLogo: protectedProcedure
      .input(UploadLogoRequestSchema)
      .mutation(async ({ input, ctx }) => {
        if (ctx.role !== UserRoleSchema.Enum.employer) {
          throw new Error('Only employers can upload logos');
        }
        return uploadLogoUseCase.execute({
          userId: ctx.userId as string,
          fileBuffer: input.fileBuffer,
          mimeType: input.mimeType,
        });
      }),
  });
};
