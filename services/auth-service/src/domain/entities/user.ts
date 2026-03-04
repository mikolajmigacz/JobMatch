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
    readonly firstName: string,
    readonly lastName: string,
    readonly companyName?: string,
    readonly companyLogoUrl?: string,
    readonly createdAt: Date = new Date(),
    readonly updatedAt: Date = new Date()
  ) {}

  static create(
    email: string,
    hashedPassword: string,
    role: UserRole,
    firstName: string,
    lastName: string,
    companyName?: string
  ): User {
    return new User(
      UserId.generate(),
      email,
      hashedPassword,
      role,
      firstName,
      lastName,
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
    firstName: string,
    lastName: string,
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
      firstName,
      lastName,
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
      this.firstName,
      this.lastName,
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
      firstName: this.firstName,
      lastName: this.lastName,
      companyName: this.companyName,
      companyLogoUrl: this.companyLogoUrl,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
