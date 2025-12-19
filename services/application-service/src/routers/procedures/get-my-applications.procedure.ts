import { TRPCError } from '@trpc/server';
import { jobSeekerProcedure } from '@infrastructure/trpc/trpc';
import { ApplicationRepository } from '@domain/repositories/application.repository';
import { JobClient } from '@infrastructure/clients';

export function createGetMyApplicationsProcedure(
  applicationRepository: ApplicationRepository,
  jobClient: JobClient
) {
  return jobSeekerProcedure.query(async ({ ctx }) => {
    try {
      const applications = await applicationRepository.getByJobSeekerId(ctx.userId!);

      // Sort by createdAt descending
      const sorted = applications.sort((a, b) => {
        const aTime = a.createdAt?.getTime() || 0;
        const bTime = b.createdAt?.getTime() || 0;
        return bTime - aTime;
      });

      // Enrich with job details
      const enriched = await Promise.all(
        sorted.map(async (app) => {
          const job = await jobClient.getJob(app.jobId);
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
            job: job
              ? {
                  jobId: job.jobId,
                  title: job.title,
                  status: job.status,
                }
              : null,
          };
        })
      );

      return enriched;
    } catch (error) {
      console.error('Error getting my applications:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch your applications',
      });
    }
  });
}
