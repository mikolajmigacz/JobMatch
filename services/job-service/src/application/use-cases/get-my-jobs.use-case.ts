import { IJobRepository } from '@domain/repositories/job.repository';
import { GetMyJobsRequest, GetMyJobsResponse } from '@jobmatch/shared';

export class GetMyJobsUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(input: GetMyJobsRequest): Promise<GetMyJobsResponse> {
    const jobs = await this.jobRepository.findByEmployerId(input.employerId);

    let filtered = jobs.map((job) => job.toPrimitive());

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
