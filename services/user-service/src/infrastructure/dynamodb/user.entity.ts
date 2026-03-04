import { PublicUser, UserRole } from '@jobmatch/shared';

export interface UserEntityItem {
  userId: string;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  companyName?: string;
  companyLogoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export function toPublicUser(item: UserEntityItem): PublicUser {
  return {
    userId: item.userId,
    email: item.email,
    role: item.role,
    firstName: item.firstName,
    lastName: item.lastName,
    companyName: item.companyName,
    companyLogoUrl: item.companyLogoUrl,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}
