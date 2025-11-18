import { PublicUser, UserRole } from '@jobmatch/shared';

export interface UserEntityItem {
  userId: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
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
    name: item.name,
    companyName: item.companyName,
    companyLogoUrl: item.companyLogoUrl,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}
