/**
 * Protected Layout
 * Layout for authenticated user pages
 */

import type { ReactNode } from 'react';
import { ErrorBoundary } from '@/shared/components/error-boundary';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      <ErrorBoundary>{children}</ErrorBoundary>
    </div>
  );
}
