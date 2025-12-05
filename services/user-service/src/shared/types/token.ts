import { UserRole } from '@jobmatch/shared';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}
