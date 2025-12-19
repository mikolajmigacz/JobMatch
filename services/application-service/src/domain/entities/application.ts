import { randomUUID } from 'crypto';

export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export class Application {
  constructor(
    readonly applicationId: string,
    readonly jobId: string,
    readonly jobSeekerId: string,
    readonly status: ApplicationStatus,
    readonly coverLetter?: string,
    readonly cvUrl?: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date,
    readonly respondedAt?: Date
  ) {}

  static create(input: {
    jobId: string;
    jobSeekerId: string;
    coverLetter?: string;
    cvUrl?: string;
  }): Application {
    return new Application(
      randomUUID(),
      input.jobId,
      input.jobSeekerId,
      ApplicationStatus.PENDING,
      input.coverLetter,
      input.cvUrl,
      new Date(),
      new Date()
    );
  }

  accept(): Application {
    return new Application(
      this.applicationId,
      this.jobId,
      this.jobSeekerId,
      ApplicationStatus.ACCEPTED,
      this.coverLetter,
      this.cvUrl,
      this.createdAt,
      new Date(),
      new Date()
    );
  }

  reject(): Application {
    return new Application(
      this.applicationId,
      this.jobId,
      this.jobSeekerId,
      ApplicationStatus.REJECTED,
      this.coverLetter,
      this.cvUrl,
      this.createdAt,
      new Date(),
      new Date()
    );
  }
}
