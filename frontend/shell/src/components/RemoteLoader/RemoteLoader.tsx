'use client';

import { type ReactNode, Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Wrapper, Loader, Fallback } from './RemoteLoader.styles';

type Props = {
  children: ReactNode;
  fallbackMessage?: string;
};

export function RemoteLoader({ children, fallbackMessage }: Props) {
  return (
    <ErrorBoundary
      fallback={
        <Fallback>
          <strong>{fallbackMessage ?? 'Module failed to load'}</strong>
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
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
