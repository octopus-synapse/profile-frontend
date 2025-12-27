import Link from "next/link";
import { Terminal, Home, ArrowLeft, Search } from "lucide-react";

/**
 * Global 404 Not Found Page
 * Developer-inspired design with code aesthetic
 */
export default function NotFound() {
  return (
    <div className="bg-pf-canvas-default flex min-h-screen flex-col items-center justify-center px-4">
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Terminal Icon */}
        <div className="relative mb-8">
          <div className="border-pf-border-default bg-pf-canvas-subtle flex h-24 w-24 items-center justify-center border">
            <Terminal className="text-pf-fg-muted h-12 w-12" strokeWidth={1.5} />
          </div>
          {/* Status indicator */}
          <div className="bg-pf-danger-fg absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full" />
        </div>

        {/* 404 Number */}
        <div className="text-pf-fg-default mb-4 font-mono text-8xl font-bold tracking-tighter">
          404
        </div>

        {/* Message */}
        <h1 className="text-pf-fg-default mb-3 text-xl font-semibold">Page not found</h1>
        <p className="text-pf-fg-muted mb-8 max-w-md font-mono text-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm transition-opacity hover:opacity-90"
          >
            <Home className="h-4 w-4" strokeWidth={1.5} />
            Go Home
          </Link>
          <Link
            href="javascript:history.back()"
            className="border-pf-border-default text-pf-fg-default hover:bg-pf-canvas-subtle inline-flex items-center justify-center gap-2 border bg-transparent px-6 py-3 font-mono text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Go Back
          </Link>
        </div>

        {/* Help text */}
        <div className="text-pf-fg-muted mt-12 flex items-center gap-2 font-mono text-xs">
          <Search className="h-4 w-4" />
          <span>
            Looking for something?{" "}
            <Link href="/auth/sign-in" className="text-pf-fg-default hover:underline">
              Sign in
            </Link>{" "}
            to access your profile.
          </span>
        </div>

        {/* Decorative code block */}
        <div className="code-block mt-8 w-full max-w-sm">
          <div className="code-block-header">
            <div className="code-block-dots">
              <span className="code-block-dot red" />
              <span className="code-block-dot yellow" />
              <span className="code-block-dot green" />
            </div>
            <span className="code-block-title">error.ts</span>
          </div>
          <div className="code-block-content text-left">
            <div>
              <span className="code-keyword">const</span>{" "}
              <span className="code-variable">response</span> = {"{"}
            </div>
            <div className="ml-4">
              <span className="code-function">status</span>:{" "}
              <span className="code-number">404</span>,
            </div>
            <div className="ml-4">
              <span className="code-function">error</span>:{" "}
              <span className="code-string">&quot;NOT_FOUND&quot;</span>,
            </div>
            <div className="ml-4">
              <span className="code-function">message</span>:{" "}
              <span className="code-string">&quot;Page not found&quot;</span>
            </div>
            <div>{"}"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
