/**
 * Auth Layout
 * Layout for authentication pages (sign-in, sign-up)
 * No navbar, centered content
 */

import type { ReactNode } from 'react';
import { ErrorBoundary } from '@/shared/components/error-boundary';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
