import { UserId } from '../value-objects/user-id';

export enum UserRole {
  JOB_SEEKER = 'job_seeker',
  EMPLOYER = 'employer',
}

export class User {
  private constructor(
    readonly userId: UserId,
    readonly email: string,
    readonly password: string,
    readonly role: UserRole,
    readonly name: string,
    readonly companyName?: string,
    readonly companyLogoUrl?: string,
    readonly createdAt: Date = new Date(),
    readonly updatedAt: Date = new Date()
  ) {}

  static create(
    email: string,
    hashedPassword: string,
    role: UserRole,
    name: string,
    companyName?: string
  ): User {
    return new User(
      UserId.generate(),
      email,
      hashedPassword,
      role,
      name,
      companyName,
      undefined,
      new Date(),
      new Date()
    );
  }

  static restore(
    userId: UserId,
    email: string,
    password: string,
    role: UserRole,
    name: string,
    companyName?: string,
    companyLogoUrl?: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ): User {
    return new User(
      userId,
      email,
      password,
      role,
      name,
      companyName,
      companyLogoUrl,
      createdAt,
      updatedAt
    );
  }

  setCompanyLogoUrl(logoUrl: string): User {
    return new User(
      this.userId,
      this.email,
      this.password,
      this.role,
      this.name,
      this.companyName,
      logoUrl,
      this.createdAt,
      new Date()
    );
  }

  toPrimitive() {
    return {
      userId: this.userId.value,
      email: this.email,
      password: this.password,
      role: this.role,
      name: this.name,
      companyName: this.companyName,
      companyLogoUrl: this.companyLogoUrl,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
