export enum UserRole {
  JOB_SEEKER = 'job_seeker',
  EMPLOYER = 'employer',
}

export class Job {
  constructor(
    readonly jobId: string,
    readonly userId: string,
    readonly title: string,
    readonly description: string,
    readonly createdAt: Date,
    readonly updatedAt: Date
  ) {}
}
