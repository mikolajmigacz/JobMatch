import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useOptimisticUpdate = () => {
  const queryClient = useQueryClient();

  const updateCache = useCallback(
    <T>(queryKey: string[], update: (oldData: T | undefined) => T) => {
      const previousData = queryClient.getQueryData<T>(queryKey);
      queryClient.setQueryData(queryKey, (oldData: T | undefined) => update(oldData));
      return previousData;
    },
    [queryClient]
  );

  const rollback = useCallback(
    <T>(queryKey: string[], previousData: T | undefined) => {
      queryClient.setQueryData(queryKey, previousData);
    },
    [queryClient]
  );

  return {
    updateCache,
    rollback,
    invalidate: (queryKey: string[]) => queryClient.invalidateQueries({ queryKey }),
  };
};
