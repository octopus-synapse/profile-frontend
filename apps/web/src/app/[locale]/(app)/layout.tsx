/**
 * Main App Layout
 * Layout with Navbar for main application pages
 * Dark theme consistent with landing page
 */

import type { ReactNode } from 'react';
import { BottomNav, Navbar } from '@/components/navigation';
import { ErrorBoundary } from '@/shared/components/error-boundary';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#020202] font-sans text-zinc-300 antialiased selection:bg-cyan-500/30">
      {/* Subtle grid background */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:40px_40px]" />
      <Navbar />
      <main className="relative z-10 flex-1 pb-20 md:pb-0">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <BottomNav />
    </div>
  );
}
