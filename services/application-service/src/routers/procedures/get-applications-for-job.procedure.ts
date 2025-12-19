import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { employerProcedure } from '@infrastructure/trpc/trpc';
import { ApplicationRepository } from '@domain/repositories/application.repository';
import { JobClient, UserClient } from '@infrastructure/clients';

export function createGetApplicationsForJobProcedure(
  applicationRepository: ApplicationRepository,
  jobClient: JobClient,
  userClient: UserClient
) {
  return employerProcedure
    .input(z.object({ jobId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      try {
        // Verify ownership
        const job = await jobClient.getJob(input.jobId);
        if (!job) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Job not found',
          });
        }

        if (job.employerId !== ctx.userId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not own this job',
          });
        }

        const applications = await applicationRepository.getByJobId(input.jobId);

        // Sort by createdAt descending
        const sorted = applications.sort((a, b) => {
          const aTime = a.createdAt?.getTime() || 0;
          const bTime = b.createdAt?.getTime() || 0;
          return bTime - aTime;
        });

        // Enrich with applicant details
        const enriched = await Promise.all(
          sorted.map(async (app) => {
            const applicant = await userClient.getUser(app.jobSeekerId);
            return {
              applicationId: app.applicationId,
              jobId: app.jobId,
              jobSeekerId: app.jobSeekerId,
              status: app.status,
              coverLetter: app.coverLetter,
              cvUrl: app.cvUrl,
              createdAt: app.createdAt?.toISOString(),
              updatedAt: app.updatedAt?.toISOString(),
              respondedAt: app.respondedAt?.toISOString(),
              applicant: applicant
                ? {
                    userId: applicant.userId,
                    email: applicant.email,
                    firstName: applicant.firstName,
                    lastName: applicant.lastName,
                  }
                : null,
            };
          })
        );

        return enriched;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Error getting applications for job:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch job applications',
        });
      }
    });
}
