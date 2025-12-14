import { randomUUID } from 'crypto';

export class JobId {
  constructor(readonly value: string) {
    if (!value || typeof value !== 'string') {
      throw new Error('JobId must be a non-empty string');
    }
  }

  static generate(): JobId {
    return new JobId(randomUUID());
  }

  static from(value: string): JobId {
    return new JobId(value);
  }

  equals(other: JobId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
