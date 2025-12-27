import Link from "next/link";
import { FileX, Home, User, FileText, Settings, ArrowLeft } from "lucide-react";

/**
 * Protected Routes 404 Not Found Page
 * Developer-inspired design with code aesthetic
 */
export default function ProtectedNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="border-pf-border-default bg-pf-canvas-subtle flex h-24 w-24 items-center justify-center border">
            <FileX className="text-pf-fg-muted h-12 w-12" strokeWidth={1.5} />
          </div>
          <div className="bg-pf-attention-fg absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full" />
        </div>

        {/* Error Code */}
        <div className="text-pf-fg-default mb-4 font-mono text-8xl font-bold tracking-tighter">
          404
        </div>

        {/* Message */}
        <h1 className="text-pf-fg-default mb-3 text-xl font-semibold">page_not_found</h1>
        <p className="text-pf-fg-muted mb-8 max-w-md font-mono text-sm">
          We couldn&apos;t find the page you&apos;re looking for. It might have been moved or
          deleted.
        </p>

        {/* Quick links */}
        <div className="mb-8 grid w-full max-w-md grid-cols-2 gap-3">
          <Link
            href="/protected/profile"
            className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default hover:border-pf-border-emphasis flex items-center justify-center gap-2 border px-4 py-3 font-mono text-xs transition-all"
          >
            <User className="h-4 w-4" strokeWidth={1.5} />
            profile
          </Link>
          <Link
            href="/protected/resume"
            className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default hover:border-pf-border-emphasis flex items-center justify-center gap-2 border px-4 py-3 font-mono text-xs transition-all"
          >
            <FileText className="h-4 w-4" strokeWidth={1.5} />
            resume
          </Link>
          <Link
            href="/protected"
            className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default hover:border-pf-border-emphasis flex items-center justify-center gap-2 border px-4 py-3 font-mono text-xs transition-all"
          >
            <Home className="h-4 w-4" strokeWidth={1.5} />
            dashboard
          </Link>
          <Link
            href="/protected/settings"
            className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default hover:border-pf-border-emphasis flex items-center justify-center gap-2 border px-4 py-3 font-mono text-xs transition-all"
          >
            <Settings className="h-4 w-4" strokeWidth={1.5} />
            settings
          </Link>
        </div>

        {/* Primary action */}
        <Link
          href="/protected"
          className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm transition-opacity hover:opacity-90"
        >
          <Home className="h-4 w-4" strokeWidth={1.5} />
          go_to_dashboard()
        </Link>

        {/* Back link */}
        <button
          onClick={() => history.back()}
          className="text-pf-fg-muted hover:text-pf-fg-default mt-6 inline-flex items-center gap-2 font-mono text-xs transition-colors"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          go_back()
        </button>
      </div>
    </div>
  );
}
