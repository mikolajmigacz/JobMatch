'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { loadRemote } from '@/utils/loadRemote';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { RemoteKey, ModuleKey } from '@/config/module-federation';
import { Wrapper, Loader, Fallback, RetryButton } from './RemoteLoader.styles';

const REMOTE_MODULE_MAP: Record<RemoteKey, ModuleKey> = {
  jobSeeker: 'APP',
  employer: 'APP',
};

type Props = {
  remoteKey: RemoteKey;
  fallbackMessage?: string;
};

export function RemoteLoader({ remoteKey, fallbackMessage }: Props) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const load = useCallback(async () => {
    setError(null);
    try {
      const moduleKey = REMOTE_MODULE_MAP[remoteKey];
      const LoadedComponent = await loadRemote(remoteKey, moduleKey);
      setComponent(() => LoadedComponent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load module');
      setComponent(null);
    }
  }, [remoteKey, retryCount]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRetry = useCallback(() => {
    setComponent(null);
    setError(null);
    setRetryCount((c) => c + 1);
  }, []);

  if (error) {
    return (
      <Fallback>
        <strong>{fallbackMessage ?? 'Module failed to load'}</strong>
        <p>{error}</p>
        <RetryButton onClick={handleRetry}>Retry</RetryButton>
      </Fallback>
    );
  }

  if (!Component) {
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <Fallback>
          <strong>{fallbackMessage ?? 'Something went wrong'}</strong>
          <RetryButton onClick={handleRetry}>Retry</RetryButton>
        </Fallback>
      }
    >
      <Suspense
        fallback={
          <Wrapper>
            <Loader />
          </Wrapper>
        }
      >
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
}
