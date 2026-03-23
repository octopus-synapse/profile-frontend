/**
 * Admin Layout
 * Layout for admin pages with sidebar navigation
 */

import type { ReactNode } from 'react';
import { AdminSidebar } from '@/components/admin';
import { ErrorBoundary } from '@/shared/components/error-boundary';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
