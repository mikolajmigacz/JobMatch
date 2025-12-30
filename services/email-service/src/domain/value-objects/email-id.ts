export class EmailId {
  constructor(public readonly value: string) {
    if (!value || typeof value !== 'string') {
      throw new Error('EmailId must be a non-empty string');
    }
  }

  static create(value: string): EmailId {
    return new EmailId(value);
  }

  equals(other: EmailId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
