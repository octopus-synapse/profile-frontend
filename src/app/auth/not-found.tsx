import Link from "next/link";
import { KeyRound, LogIn, UserPlus, Home, ArrowLeft } from "lucide-react";

/**
 * Auth 404 Not Found Page
 * Developer-inspired design with code aesthetic
 */
export default function AuthNotFound() {
  return (
    <div className="bg-pf-canvas-default flex min-h-screen flex-col items-center justify-center px-4">
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="border-pf-border-default bg-pf-canvas-subtle flex h-24 w-24 items-center justify-center border">
            <KeyRound className="text-pf-fg-muted h-12 w-12" strokeWidth={1.5} />
          </div>
          <div className="bg-pf-attention-fg absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full" />
        </div>

        {/* Error Code */}
        <div className="text-pf-fg-default mb-4 font-mono text-8xl font-bold tracking-tighter">
          404
        </div>

        {/* Message */}
        <h1 className="text-pf-fg-default mb-3 text-xl font-semibold">auth_page_not_found</h1>
        <p className="text-pf-fg-muted mb-8 max-w-sm font-mono text-sm">
          The page you&apos;re looking for doesn&apos;t exist. Try signing in or creating a new
          account.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/auth/sign-in"
            className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm transition-opacity hover:opacity-90"
          >
            <LogIn className="h-4 w-4" strokeWidth={1.5} />
            sign_in()
          </Link>
          <Link
            href="/auth/sign-up"
            className="border-pf-border-default text-pf-fg-default hover:bg-pf-canvas-subtle inline-flex items-center justify-center gap-2 border bg-transparent px-6 py-3 font-mono text-sm transition-colors"
          >
            <UserPlus className="h-4 w-4" strokeWidth={1.5} />
            create_account()
          </Link>
        </div>

        {/* Code Block */}
        <div className="code-block mt-8 w-full max-w-sm">
          <div className="code-block-header">
            <div className="code-block-dots">
              <span className="code-block-dot red" />
              <span className="code-block-dot yellow" />
              <span className="code-block-dot green" />
            </div>
            <span className="code-block-title">auth-error.ts</span>
          </div>
          <div className="code-block-content text-left">
            <div>
              <span className="code-keyword">const</span>{" "}
              <span className="code-variable">error</span> = {"{"}
            </div>
            <div className="ml-4">
              <span className="code-function">code</span>: <span className="code-number">404</span>,
            </div>
            <div className="ml-4">
              <span className="code-function">message</span>:{" "}
              <span className="code-string">&quot;Page not found&quot;</span>
            </div>
            <div>{"}"}</div>
          </div>
        </div>

        {/* Home link */}
        <div className="mt-8 flex items-center gap-4 font-mono text-xs">
          <Link
            href="/"
            className="text-pf-fg-muted hover:text-pf-fg-default inline-flex items-center gap-2 transition-colors"
          >
            <Home className="h-3 w-3" strokeWidth={1.5} />
            go_home
          </Link>
          <span className="text-pf-fg-subtle">|</span>
          <button
            onClick={() => history.back()}
            className="text-pf-fg-muted hover:text-pf-fg-default inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
            go_back
          </button>
        </div>
      </div>
    </div>
  );
}
