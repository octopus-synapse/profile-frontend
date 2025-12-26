/**
 * Admin Layout
 * Layout for admin pages with admin-specific styling
 */

import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      {/* Admin Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-sm text-orange-500">
        <span className="h-2 w-2 rounded-full bg-orange-500" />
        Admin Panel
      </div>
      {children}
    </div>
  );
}
