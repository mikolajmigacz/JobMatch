import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure, employerProcedure } from '@infrastructure/trpc/trpc';
import {
  CreateJobDtoSchema,
  UpdateJobDtoSchema,
  JobFilterSchema,
  GetMyJobsFilterSchema,
} from '@jobmatch/shared';
import {
  GetAllJobsUseCase,
  GetJobUseCase,
  GetMyJobsUseCase,
  CreateJobUseCase,
  UpdateJobUseCase,
  DeleteJobUseCase,
} from '@application/use-cases';

interface JobRouterDependencies {
  getAllJobsUseCase: GetAllJobsUseCase;
  getJobUseCase: GetJobUseCase;
  getMyJobsUseCase: GetMyJobsUseCase;
  createJobUseCase: CreateJobUseCase;
  updateJobUseCase: UpdateJobUseCase;
  deleteJobUseCase: DeleteJobUseCase;
}

export function createJobRouter(deps: JobRouterDependencies) {
  const {
    getAllJobsUseCase,
    getJobUseCase,
    getMyJobsUseCase,
    createJobUseCase,
    updateJobUseCase,
    deleteJobUseCase,
  } = deps;

  return router({
    getAllJobs: publicProcedure.input(JobFilterSchema).query(async ({ input }) => {
      try {
        return await getAllJobsUseCase.execute(input);
      } catch (error) {
        console.error('Error getting all jobs:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch jobs',
        });
      }
    }),

    getJob: publicProcedure
      .input(z.object({ jobId: z.string().uuid() }))
      .query(async ({ input }) => {
        try {
          const job = await getJobUseCase.execute(input);

          if (!job) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Job not found',
            });
          }

          return job;
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          console.error('Error getting job:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch job',
          });
        }
      }),

    getMyJobs: employerProcedure.input(GetMyJobsFilterSchema).query(async ({ ctx, input }) => {
      try {
        return await getMyJobsUseCase.execute({
          ...input,
          employerId: ctx.userId,
        });
      } catch (error) {
        console.error('Error getting my jobs:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch your jobs',
        });
      }
    }),

    createJob: employerProcedure.input(CreateJobDtoSchema).mutation(async ({ ctx, input }) => {
      try {
        return await createJobUseCase.execute({
          ...input,
          employerId: ctx.userId,
        });
      } catch (error) {
        console.error('Error creating job:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create job',
        });
      }
    }),

    updateJob: employerProcedure
      .input(
        z.object({
          jobId: z.string().uuid(),
          data: UpdateJobDtoSchema,
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          return await updateJobUseCase.execute({
            jobId: input.jobId,
            employerId: ctx.userId,
            ...input.data,
          });
        } catch (error) {
          if (error instanceof Error) {
            if (error.message.includes('not found')) {
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Job not found',
              });
            }
            if (error.message.includes('Forbidden')) {
              throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You can only update your own jobs',
              });
            }
          }
          console.error('Error updating job:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update job',
          });
        }
      }),

    deleteJob: employerProcedure
      .input(z.object({ jobId: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        try {
          return await deleteJobUseCase.execute({
            jobId: input.jobId,
            employerId: ctx.userId,
          });
        } catch (error) {
          if (error instanceof Error) {
            if (error.message.includes('not found')) {
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Job not found',
              });
            }
            if (error.message.includes('Forbidden')) {
              throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You can only delete your own jobs',
              });
            }
          }
          console.error('Error deleting job:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete job',
          });
        }
      }),
  });
}

export type JobRouter = ReturnType<typeof createJobRouter>;
