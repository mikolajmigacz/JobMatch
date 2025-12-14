import { router } from '@infrastructure/trpc/trpc';
import {
  GetAllJobsUseCase,
  GetJobUseCase,
  GetMyJobsUseCase,
  CreateJobUseCase,
  UpdateJobUseCase,
  DeleteJobUseCase,
} from '@application/use-cases';
import {
  createGetAllJobsProcedure,
  createGetJobProcedure,
  createGetMyJobsProcedure,
  createCreateJobProcedure,
  createUpdateJobProcedure,
  createDeleteJobProcedure,
} from './procedures';

export interface JobRouterDependencies {
  getAllJobsUseCase: GetAllJobsUseCase;
  getJobUseCase: GetJobUseCase;
  getMyJobsUseCase: GetMyJobsUseCase;
  createJobUseCase: CreateJobUseCase;
  updateJobUseCase: UpdateJobUseCase;
  deleteJobUseCase: DeleteJobUseCase;
}

export function createJobRouter(dependencies: JobRouterDependencies) {
  const {
    getAllJobsUseCase,
    getJobUseCase,
    getMyJobsUseCase,
    createJobUseCase,
    updateJobUseCase,
    deleteJobUseCase,
  } = dependencies;

  return router({
    getAllJobs: createGetAllJobsProcedure(getAllJobsUseCase),
    getJob: createGetJobProcedure(getJobUseCase),
    getMyJobs: createGetMyJobsProcedure(getMyJobsUseCase),
    createJob: createCreateJobProcedure(createJobUseCase),
    updateJob: createUpdateJobProcedure(updateJobUseCase),
    deleteJob: createDeleteJobProcedure(deleteJobUseCase),
  });
}

export type JobRouter = ReturnType<typeof createJobRouter>;
