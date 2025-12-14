import { Job } from '@domain/entities';
import { IJobRepository } from '@domain/repositories/job.repository';
import { CreateJobRequest, CreateJobResponse } from '@jobmatch/shared';

export class CreateJobUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(input: CreateJobRequest): Promise<CreateJobResponse> {
    const job = Job.create(
      input.employerId,
      input.title,
      input.description,
      input.location,
      input.employmentType,
      input.skills,
      input.requirements,
      input.companyName,
      input.salaryMin,
      input.salaryMax
    );

    await this.jobRepository.save(job);
    return job.toPrimitive();
  }
}
