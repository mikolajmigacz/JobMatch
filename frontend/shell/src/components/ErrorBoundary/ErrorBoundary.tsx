'use client';

import React, { Component, type ReactNode } from 'react';
import { ErrorFallback } from './ErrorBoundary.styles';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback ?? (
          <ErrorFallback>
            <strong>Something went wrong</strong>
            <p>{this.state.error.message}</p>
          </ErrorFallback>
        )
      );
    }
    return this.props.children;
  }
}
