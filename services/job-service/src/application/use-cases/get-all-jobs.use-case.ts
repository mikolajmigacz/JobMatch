import { IJobRepository } from '@domain/repositories/job.repository';
import { JobFilterRequest, GetAllJobsResponse } from '@jobmatch/shared';

export class GetAllJobsUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(input: JobFilterRequest): Promise<GetAllJobsResponse> {
    const jobs = await this.jobRepository.findAll();

    let filtered = jobs.map((job) => job.toPrimitive());

    filtered = filtered.filter((job) => job.status === 'active');

    if (input.title) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(input.title!.toLowerCase())
      );
    }

    if (input.location) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(input.location!.toLowerCase())
      );
    }

    if (input.employmentType && input.employmentType.length > 0) {
      filtered = filtered.filter((job) =>
        input.employmentType!.includes(job.employmentType as any)
      );
    }

    if (input.skills && input.skills.length > 0) {
      filtered = filtered.filter((job) =>
        input.skills!.some((skill) =>
          job.skills.some((jobSkill) => jobSkill.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }

    if (input.salaryMin !== undefined) {
      filtered = filtered.filter((job) => !job.salaryMax || job.salaryMax >= input.salaryMin!);
    }

    if (input.salaryMax !== undefined) {
      filtered = filtered.filter((job) => !job.salaryMin || job.salaryMin <= input.salaryMax!);
    }

    const sortBy = input.sortBy ?? 'createdAt';
    const sortOrder = input.sortOrder ?? 'desc';

    filtered = filtered.sort((a, b) => {
      const aValue =
        sortBy === 'createdAt'
          ? new Date(a.createdAt).getTime()
          : (a[sortBy as keyof typeof a] as any);
      const bValue =
        sortBy === 'createdAt'
          ? new Date(b.createdAt).getTime()
          : (b[sortBy as keyof typeof b] as any);

      if (typeof aValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue);
      }
      return sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    const page = input.page ?? 1;
    const limit = input.limit ?? 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit,
      hasMore: end < filtered.length,
    };
  }
}
