import { JobStatus } from '@jobmatch/shared';

export interface JobDetails {
  jobId: string;
  title: string;
  status: JobStatus;
  employerId: string;
  companyName: string;
}

export class JobClient {
  constructor(private jobServiceUrl: string) {}

  async getJob(jobId: string): Promise<JobDetails | null> {
    try {
      const response = await fetch(
        `${this.jobServiceUrl}/trpc/job.getJob?input=${JSON.stringify({ jobId })}`
      );

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as { result?: { data?: JobDetails } };
      return data.result?.data ?? null;
    } catch (error) {
      console.error('Failed to fetch job details:', error);
      return null;
    }
  }
}
