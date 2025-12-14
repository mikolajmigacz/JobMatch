import { TRPCError } from '@trpc/server';
import { protectedProcedure } from '@infrastructure/trpc/trpc';
import { UploadLogoRequestSchema, UserRoleSchema } from '@jobmatch/shared';
import { UploadLogoUseCase } from '@application/use-cases';

export function createUploadLogoProcedure(uploadLogoUseCase: UploadLogoUseCase) {
  return protectedProcedure.input(UploadLogoRequestSchema).mutation(async ({ input, ctx }) => {
    if (ctx.role !== UserRoleSchema.Enum.employer) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only employers can upload logos',
      });
    }
    return uploadLogoUseCase.execute({
      userId: ctx.userId as string,
      fileBuffer: input.fileBuffer,
      mimeType: input.mimeType,
    });
  });
}
