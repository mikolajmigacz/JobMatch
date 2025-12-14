import { Job, JobId } from '@domain/entities';
import { IJobRepository } from '@domain/repositories/job.repository';
import { DeleteJobRequest, DeleteJobResponse } from '@jobmatch/shared';

export class DeleteJobUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(input: DeleteJobRequest): Promise<DeleteJobResponse> {
    const jobId = JobId.from(input.jobId);
    const job = await this.jobRepository.findById(jobId);

    if (!job) {
      throw new Error('Job not found');
    }

    if (job.employerId !== input.employerId) {
      throw new Error('Forbidden: You can only delete your own jobs');
    }

    const closedJob = Job.restore(
      jobId,
      job.employerId,
      job.title,
      job.description,
      job.location,
      job.salaryMin,
      job.salaryMax,
      job.employmentType,
      job.skills,
      job.requirements,
      job.companyName,
      'closed',
      job.createdAt,
      new Date()
    );

    await this.jobRepository.update(closedJob);
    return { success: true, jobId: job.jobId.value };
  }
}
