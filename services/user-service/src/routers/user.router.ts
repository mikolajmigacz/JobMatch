import { router } from '@infrastructure/trpc/trpc';
import { UserRepository } from '@domain/repositories/user.repository';
import { EnvConfig } from '@config/env.config';
import {
  GetProfileUseCase,
  UpdateProfileUseCase,
  DeleteUserUseCase,
  UploadLogoUseCase,
} from '@application/use-cases';
import { S3FileStorageService } from '@infrastructure/services/s3-file-storage.service';
import {
  createGetProfileProcedure,
  createUpdateProfileProcedure,
  createDeleteUserProcedure,
  createUploadLogoProcedure,
} from './procedures';

export interface UserRouterDependencies {
  getProfileUseCase: GetProfileUseCase;
  updateProfileUseCase: UpdateProfileUseCase;
  deleteUserUseCase: DeleteUserUseCase;
  uploadLogoUseCase: UploadLogoUseCase;
}

export const createUserRouter = (repository: UserRepository, config: EnvConfig) => {
  const getProfileUseCase = new GetProfileUseCase(repository);
  const updateProfileUseCase = new UpdateProfileUseCase(repository);
  const s3Service = new S3FileStorageService(config);
  const deleteUserUseCase = new DeleteUserUseCase(repository, s3Service);
  const uploadLogoUseCase = new UploadLogoUseCase(repository, s3Service);

  return router({
    getUser: createGetProfileProcedure(getProfileUseCase),
    updateUser: createUpdateProfileProcedure(updateProfileUseCase),
    deleteUser: createDeleteUserProcedure(deleteUserUseCase),
    uploadLogo: createUploadLogoProcedure(uploadLogoUseCase),
  });
};

export type UserRouter = ReturnType<typeof createUserRouter>;
