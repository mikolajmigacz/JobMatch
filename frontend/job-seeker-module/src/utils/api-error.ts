import { TRPCClientError } from '@trpc/client';

export class ApiError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof TRPCClientError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
};

export const getErrorCode = (error: unknown): string => {
  if (error instanceof TRPCClientError) {
    return error.shape?.code || 'UNKNOWN_ERROR';
  }

  if (error instanceof ApiError) {
    return error.code;
  }

  return 'UNKNOWN_ERROR';
};

export const isUnauthorizedError = (error: unknown): boolean => {
  if (error instanceof TRPCClientError) {
    return error.shape?.code === 'UNAUTHORIZED';
  }
  return false;
};

export const isForbiddenError = (error: unknown): boolean => {
  if (error instanceof TRPCClientError) {
    return error.shape?.code === 'FORBIDDEN';
  }
  return false;
};

export const isNotFoundError = (error: unknown): boolean => {
  if (error instanceof TRPCClientError) {
    return error.shape?.code === 'NOT_FOUND';
  }
  return false;
};
