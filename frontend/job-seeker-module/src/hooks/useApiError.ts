import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage, getErrorCode, isUnauthorizedError } from '@/utils/api-error';

export interface UseApiErrorOptions {
  onUnauthorized?: () => void;
  onError?: (error: unknown) => void;
}

export const useApiError = (options: UseApiErrorOptions = {}) => {
  const handleError = useCallback(
    (error: unknown) => {
      if (isUnauthorizedError(error)) {
        options.onUnauthorized?.();
        return;
      }

      options.onError?.(error);
    },
    [options]
  );

  return {
    getErrorMessage,
    getErrorCode,
    handleError,
  };
};

export const useMutationWithError = <T, V>(
  mutationFn: (data: V) => Promise<T>,
  options?: UseApiErrorOptions
) => {
  const apiError = useApiError(options);

  return useMutation({
    mutationFn,
    onError: (error) => {
      apiError.handleError(error);
    },
  });
};
