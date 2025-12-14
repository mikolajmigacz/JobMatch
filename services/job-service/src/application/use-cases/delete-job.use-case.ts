import { JobId } from '@domain/entities';
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

    await this.jobRepository.delete(jobId);
    return { success: true, jobId: job.jobId.value };
  }
}
