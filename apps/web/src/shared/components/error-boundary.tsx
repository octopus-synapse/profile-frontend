'use client';

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components
 */

import { Button } from '@octopus-synapse/profile-ui';
import { useI18n } from '@profile/i18n';
import { Component, type ReactNode, Suspense } from 'react';

/**
 * Default fallback UI component (uses i18n)
 */
function DefaultErrorFallback({ error, onRetry }: { error: Error | null; onRetry: () => void }) {
  const { t } = useI18n();

  return (
    <div className="border border-white/10 bg-[#0A0A0A]/80 flex min-h-[200px] flex-col items-center justify-center rounded-lg p-6">
      <h3 className="text-white mb-2 text-lg font-semibold">{t('error.boundary.title')}</h3>
      <p className="text-zinc-400 mb-4 text-sm">{t('error.boundary.description')}</p>
      <Button type="button" variant="solid" tone="neutral" size="sm" onPress={onRetry}>
        {t('error.boundary.retry')}
      </Button>
      {process.env.NODE_ENV === 'development' && error && (
        <pre className="bg-black/50 mt-4 max-w-full overflow-auto rounded p-2 text-xs text-red-400">
          {error.message}
        </pre>
      )}
    </div>
  );
}

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

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <DefaultErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
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
