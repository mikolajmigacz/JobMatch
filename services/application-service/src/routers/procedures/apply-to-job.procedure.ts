import { TRPCError } from '@trpc/server';
import { jobSeekerProcedure } from '@infrastructure/trpc/trpc';
import { ApplyToJobDtoSchema } from '@jobmatch/shared';
import { ApplicationRepository } from '@domain/repositories/application.repository';
import { Application } from '@domain/entities';
import { SQSService } from '@infrastructure/services/sqs.service';
import { JobClient, UserClient } from '@infrastructure/clients';
import { publishApplicationCreatedUseCase } from '@application/use-cases';

export function createApplyToJobProcedure(
  applicationRepository: ApplicationRepository,
  sqsService: SQSService,
  jobClient: JobClient,
  userClient: UserClient
) {
  return jobSeekerProcedure.input(ApplyToJobDtoSchema).mutation(async ({ ctx, input }) => {
    try {
      // Validate job exists and is active
      const job = await jobClient.getJob(input.jobId);
      if (!job) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Job not found',
        });
      }

      if (job.status !== 'active') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Job is not active',
        });
      }

      // Check for duplicate application
      const existing = await applicationRepository.checkExisting(input.jobId, ctx.userId!);
      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Already applied to this job',
        });
      }

      // Get user details
      const user = await userClient.getUser(ctx.userId!);
      if (!user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User not found',
        });
      }

      // Get employer details
      const employer = await userClient.getUser(job.employerId);
      if (!employer) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Employer not found',
        });
      }

      // Create application
      const application = Application.create({
        jobId: input.jobId,
        jobSeekerId: ctx.userId!,
        coverLetter: input.coverLetter,
      });

      const created = await applicationRepository.create(application);

      // Publish event to SQS
      try {
        await publishApplicationCreatedUseCase(sqsService, {
          applicationId: created.applicationId,
          employerEmail: employer.email,
          employerName: `${employer.firstName} ${employer.lastName}`,
          jobTitle: job.title,
          applicantName: `${user.firstName} ${user.lastName}`,
          applicantEmail: user.email,
          coverLetter: input.coverLetter,
        });
      } catch (error) {
        console.error('Failed to publish APPLICATION_CREATED event:', error);
      }

      return {
        applicationId: created.applicationId,
        jobId: created.jobId,
        jobSeekerId: created.jobSeekerId,
        status: created.status,
        createdAt: created.createdAt?.toISOString(),
        updatedAt: created.updatedAt?.toISOString(),
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      console.error('Error applying to job:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to apply to job',
      });
    }
  });
}
