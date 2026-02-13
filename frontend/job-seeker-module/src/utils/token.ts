export const TOKEN_KEY = 'jobMatch_token';
export const USER_KEY = 'jobMatch_user';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
};

export const hasToken = (): boolean => {
  return getToken() !== null;
};

export interface UserData {
  [key: string]: string | number | boolean | null;
}

export const getUser = (): UserData | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? (JSON.parse(user) as UserData) : null;
};

export const setUser = (user: UserData): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
};

export const clearAuthStorage = (): void => {
  if (typeof window === 'undefined') return;
  removeToken();
  removeUser();
};
