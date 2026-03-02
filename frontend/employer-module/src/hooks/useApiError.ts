import { useState, useCallback } from 'react';
import { getErrorMessage } from '@/utils/api-error';

export function useApiError() {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: unknown) => {
    setError(getErrorMessage(err));
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { error, handleError, clearError };
}
