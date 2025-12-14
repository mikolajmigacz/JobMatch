import { JobId } from '@domain/entities';
import { IJobRepository } from '@domain/repositories/job.repository';
import { GetJobResponse } from '@jobmatch/shared';

export class GetJobUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(input: { jobId: string }): Promise<GetJobResponse> {
    const job = await this.jobRepository.findById(JobId.from(input.jobId));
    return job ? job.toPrimitive() : null;
  }
}
