import { Job } from '../entities/job';
import { JobId } from '../value-objects/job-id';

export interface IJobRepository {
  save(job: Job): Promise<void>;
  findById(jobId: JobId): Promise<Job | null>;
  findByEmployerId(employerId: string): Promise<Job[]>;
  findByStatus(status: 'active' | 'closed'): Promise<Job[]>;
  findAll(): Promise<Job[]>;
  delete(jobId: JobId): Promise<void>;
  update(job: Job): Promise<void>;
}

export const IJobRepository = Symbol('IJobRepository');
