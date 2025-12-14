import { JobId } from '../value-objects/job-id';

export enum UserRole {
  JOB_SEEKER = 'job_seeker',
  EMPLOYER = 'employer',
}

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type JobStatus = 'active' | 'closed';

export class Job {
  private constructor(
    readonly jobId: JobId,
    readonly employerId: string,
    readonly title: string,
    readonly description: string,
    readonly location: string,
    readonly salaryMin: number | undefined,
    readonly salaryMax: number | undefined,
    readonly employmentType: EmploymentType,
    readonly skills: string[],
    readonly requirements: string,
    readonly companyName: string,
    readonly status: JobStatus,
    readonly createdAt: Date,
    readonly updatedAt: Date
  ) {}

  static create(
    employerId: string,
    title: string,
    description: string,
    location: string,
    employmentType: EmploymentType,
    skills: string[],
    requirements: string,
    companyName: string,
    salaryMin?: number,
    salaryMax?: number
  ): Job {
    const now = new Date();
    return new Job(
      JobId.generate(),
      employerId,
      title,
      description,
      location,
      salaryMin,
      salaryMax,
      employmentType,
      skills,
      requirements,
      companyName,
      'active',
      now,
      now
    );
  }

  static restore(
    jobId: JobId,
    employerId: string,
    title: string,
    description: string,
    location: string,
    salaryMin: number | undefined,
    salaryMax: number | undefined,
    employmentType: EmploymentType,
    skills: string[],
    requirements: string,
    companyName: string,
    status: JobStatus,
    createdAt: Date,
    updatedAt: Date
  ): Job {
    return new Job(
      jobId,
      employerId,
      title,
      description,
      location,
      salaryMin,
      salaryMax,
      employmentType,
      skills,
      requirements,
      companyName,
      status,
      createdAt,
      updatedAt
    );
  }

  toPrimitive() {
    return {
      jobId: this.jobId.value,
      employerId: this.employerId,
      title: this.title,
      description: this.description,
      location: this.location,
      salaryMin: this.salaryMin,
      salaryMax: this.salaryMax,
      employmentType: this.employmentType,
      skills: this.skills,
      requirements: this.requirements,
      companyName: this.companyName,
      status: this.status,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
