import { UserDetails } from '@jobmatch/shared';

export class UserClient {
  constructor(private userServiceUrl: string) {}

  async getUser(userId: string): Promise<UserDetails | null> {
    try {
      const response = await fetch(
        `${this.userServiceUrl}/trpc/user.getById?input=${JSON.stringify({ userId })}`
      );

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as { result?: { data?: UserDetails } };
      return data.result?.data ?? null;
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      return null;
    }
  }
}
