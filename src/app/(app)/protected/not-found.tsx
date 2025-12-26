import Link from "next/link";
import { FileX, Home, User, FileText, Settings, ArrowLeft } from "lucide-react";

/**
 * Protected Routes 404 Not Found Page
 * GitHub/Cursor-inspired design for authenticated users
 */
export default function ProtectedNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      {/* Background gradient effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="from-gh-accent-emphasis/5 absolute -top-1/2 left-1/3 h-[500px] w-[500px] rounded-full bg-gradient-to-b to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="border-gh-border-default bg-gh-canvas-subtle mb-8 flex h-24 w-24 items-center justify-center rounded-2xl border">
          <FileX className="text-gh-fg-muted h-12 w-12" />
        </div>

        {/* 404 */}
        <div className="text-gh-fg-default mb-4 font-mono text-7xl font-bold">404</div>

        {/* Message */}
        <h1 className="text-gh-fg-default mb-3 text-xl font-semibold">Page not found</h1>
        <p className="text-gh-fg-muted mb-8 max-w-md">
          We couldn&apos;t find the page you&apos;re looking for. It might have been moved or
          deleted.
        </p>

        {/* Quick links */}
        <div className="mb-8 grid w-full max-w-md grid-cols-2 gap-3">
          <Link
            href="/protected/profile"
            className="border-gh-border-default bg-gh-canvas-subtle text-gh-fg-default hover:border-gh-border-muted hover:bg-gh-canvas-inset flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
          <Link
            href="/protected/resume"
            className="border-gh-border-default bg-gh-canvas-subtle text-gh-fg-default hover:border-gh-border-muted hover:bg-gh-canvas-inset flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all"
          >
            <FileText className="h-4 w-4" />
            Resume
          </Link>
          <Link
            href="/protected/dashboard"
            className="border-gh-border-default bg-gh-canvas-subtle text-gh-fg-default hover:border-gh-border-muted hover:bg-gh-canvas-inset flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/protected/settings"
            className="border-gh-border-default bg-gh-canvas-subtle text-gh-fg-default hover:border-gh-border-muted hover:bg-gh-canvas-inset flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>

        {/* Primary action */}
        <Link
          href="/protected/dashboard"
          className="bg-gh-accent-emphasis hover:bg-gh-accent-emphasis/90 inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium text-white transition-all"
        >
          <Home className="h-4 w-4" />
          Go to Dashboard
        </Link>

        {/* Back link */}
        <Link
          href="javascript:history.back()"
          className="text-gh-fg-muted hover:text-gh-fg-default mt-6 inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back
        </Link>
      </div>
    </div>
  );
}
