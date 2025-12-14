import { Job, JobId } from '@domain/entities';
import { IJobRepository } from '@domain/repositories/job.repository';
import { UpdateJobRequest, UpdateJobResponse } from '@jobmatch/shared';

export class UpdateJobUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(input: UpdateJobRequest): Promise<UpdateJobResponse> {
    const jobId = JobId.from(input.jobId);
    const existingJob = await this.jobRepository.findById(jobId);

    if (!existingJob) {
      throw new Error('Job not found');
    }

    if (existingJob.employerId !== input.employerId) {
      throw new Error('Forbidden: You can only update your own jobs');
    }

    const updatedJob = Job.restore(
      jobId,
      existingJob.employerId,
      input.title ?? existingJob.title,
      input.description ?? existingJob.description,
      input.location ?? existingJob.location,
      input.salaryMin ?? existingJob.salaryMin,
      input.salaryMax ?? existingJob.salaryMax,
      input.employmentType ?? existingJob.employmentType,
      input.skills ?? existingJob.skills,
      input.requirements ?? existingJob.requirements,
      input.companyName ?? existingJob.companyName,
      existingJob.status,
      existingJob.createdAt,
      new Date()
    );

    await this.jobRepository.update(updatedJob);
    return updatedJob.toPrimitive();
  }
}
