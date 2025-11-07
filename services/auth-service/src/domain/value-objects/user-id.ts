import { randomUUID } from 'crypto';

export class UserId {
  constructor(readonly value: string) {
    if (!value || typeof value !== 'string') {
      throw new Error('UserId must be a non-empty string');
    }
  }

  static generate(): UserId {
    return new UserId(randomUUID());
  }

  static from(value: string): UserId {
    return new UserId(value);
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
