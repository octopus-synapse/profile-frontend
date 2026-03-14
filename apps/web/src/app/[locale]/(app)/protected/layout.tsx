/**
 * Protected Layout
 * Layout for authenticated user pages
 */

import type { ReactNode } from 'react';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return <div className="mx-auto max-w-screen-xl px-4 py-8">{children}</div>;
}
