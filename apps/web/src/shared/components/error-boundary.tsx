'use client';

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components
 */

import { Component, type ReactNode, Suspense } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="border-pf-border bg-pf-bg-secondary flex min-h-[200px] flex-col items-center justify-center rounded-lg border p-6">
          <h3 className="text-pf-fg mb-2 text-lg font-semibold">Something went wrong</h3>
          <p className="text-pf-fg-muted mb-4 text-sm">
            An error occurred while rendering this component.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-pf-fg text-pf-bg rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
          >
            Try again
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="bg-pf-bg mt-4 max-w-full overflow-auto rounded p-2 text-xs text-red-400">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Async Error Boundary for Suspense
 */
export function AsyncBoundary({
  children,
  loadingFallback,
  errorFallback,
}: {
  children: ReactNode;
  loadingFallback: ReactNode;
  errorFallback?: ReactNode;
}) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
