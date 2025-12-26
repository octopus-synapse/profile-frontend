import Link from "next/link";
import { ShieldAlert, LayoutDashboard, ArrowLeft, Users } from "lucide-react";

/**
 * Admin 404 Not Found Page
 * GitHub/Cursor-inspired design for admin section
 */
export default function AdminNotFound() {
  return (
    <div className="bg-gh-canvas-default flex min-h-screen flex-col items-center justify-center px-4">
      {/* Background gradient effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="from-gh-danger-subtle/20 absolute -top-1/2 right-0 h-[600px] w-[600px] rounded-full bg-gradient-to-b to-transparent blur-3xl" />
        <div className="from-gh-accent-subtle/10 absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-t to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Admin shield icon */}
        <div className="relative mb-8">
          <div className="border-gh-danger-muted/30 bg-gh-canvas-subtle flex h-28 w-28 items-center justify-center rounded-xl border shadow-lg">
            <ShieldAlert className="text-gh-danger-fg h-14 w-14" />
          </div>
          {/* Status indicator */}
          <div className="border-gh-canvas-default bg-gh-danger-emphasis absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full border-2">
            <span className="text-xs font-bold text-white">!</span>
          </div>
        </div>

        {/* Error code with admin badge */}
        <div className="mb-4 flex items-center gap-3">
          <span className="bg-gh-danger-subtle text-gh-danger-fg rounded-full px-3 py-1 text-xs font-medium">
            ADMIN
          </span>
          <span className="text-gh-fg-default font-mono text-6xl font-bold">404</span>
        </div>

        {/* Message */}
        <h1 className="text-gh-fg-default mb-3 text-xl font-semibold">Admin Page Not Found</h1>
        <p className="text-gh-fg-muted mb-8 max-w-md">
          This admin resource doesn&apos;t exist or you may not have permission to access it. Return
          to the admin dashboard or check your access level.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin"
            className="bg-gh-accent-emphasis hover:bg-gh-accent-emphasis/90 focus:ring-gh-accent-emphasis focus:ring-offset-gh-canvas-default inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium text-white transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            <LayoutDashboard className="h-4 w-4" />
            Admin Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="border-gh-border-default bg-gh-canvas-subtle text-gh-fg-default hover:bg-gh-canvas-inset hover:border-gh-border-muted focus:ring-gh-accent-emphasis focus:ring-offset-gh-canvas-default inline-flex items-center justify-center gap-2 rounded-md border px-6 py-3 text-sm font-medium transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            <Users className="h-4 w-4" />
            Manage Users
          </Link>
        </div>

        {/* Quick navigation */}
        <div className="border-gh-border-default bg-gh-canvas-subtle mt-10 rounded-lg border p-4">
          <h3 className="text-gh-fg-default mb-3 text-sm font-medium">Quick Navigation</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link
              href="/admin"
              className="text-gh-fg-muted hover:bg-gh-canvas-inset hover:text-gh-fg-default flex items-center gap-2 rounded-md px-3 py-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="text-gh-fg-muted hover:bg-gh-canvas-inset hover:text-gh-fg-default flex items-center gap-2 rounded-md px-3 py-2"
            >
              <Users className="h-4 w-4" />
              Users
            </Link>
          </div>
        </div>

        {/* Back link */}
        <Link
          href="javascript:history.back()"
          className="text-gh-fg-muted hover:text-gh-fg-default mt-6 inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back to previous page
        </Link>
      </div>
    </div>
  );
}
