import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { employerProcedure } from '@infrastructure/trpc/trpc';
import { ApplicationRepository } from '@domain/repositories/application.repository';
import { ApplicationStatus } from '@domain/entities';
import { SQSService } from '@infrastructure/services/sqs.service';
import { JobClient, UserClient } from '@infrastructure/clients';
import { publishApplicationAcceptedUseCase } from '@application/use-cases';

export function createAcceptApplicationProcedure(
  applicationRepository: ApplicationRepository,
  sqsService: SQSService,
  jobClient: JobClient,
  userClient: UserClient
) {
  return employerProcedure
    .input(z.object({ applicationId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const application = await applicationRepository.getById(input.applicationId);
        if (!application) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Application not found',
          });
        }

        // Verify ownership
        const job = await jobClient.getJob(application.jobId);
        if (!job || job.employerId !== ctx.userId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not own this job',
          });
        }

        // Check if already responded
        if (application.status !== ApplicationStatus.PENDING) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Application has already been responded to',
          });
        }

        const accepted = application.accept();
        const updated = await applicationRepository.update(input.applicationId, {
          status: accepted.status,
          respondedAt: new Date(),
        });

        if (updated) {
          const jobSeeker = await userClient.getUser(application.jobSeekerId);
          if (!jobSeeker) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Job seeker not found',
            });
          }

          try {
            await publishApplicationAcceptedUseCase(sqsService, {
              applicationId: updated.applicationId,
              jobSeekerEmail: jobSeeker.email,
              jobSeekerName: `${jobSeeker.firstName} ${jobSeeker.lastName}`,
              jobTitle: job.title,
              companyName: job.companyName,
            });
          } catch (error) {
            console.error('Failed to publish APPLICATION_ACCEPTED event:', error);
          }
        }

        return {
          applicationId: updated?.applicationId,
          status: updated?.status,
          respondedAt: updated?.respondedAt?.toISOString(),
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Error accepting application:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to accept application',
        });
      }
    });
}
