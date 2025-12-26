import Link from "next/link";
import { KeyRound, LogIn, UserPlus, Home, ArrowLeft } from "lucide-react";

/**
 * Auth 404 Not Found Page
 * GitHub/Cursor-inspired design for authentication section
 */
export default function AuthNotFound() {
  return (
    <div className="bg-gh-canvas-default flex min-h-screen flex-col items-center justify-center px-4">
      {/* Background gradient effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="from-gh-accent-emphasis/10 absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-b to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="border-gh-border-default bg-gh-canvas-subtle mb-8 flex h-20 w-20 items-center justify-center rounded-full border">
          <KeyRound className="text-gh-fg-muted h-10 w-10" />
        </div>

        {/* 404 */}
        <div className="text-gh-fg-default mb-4 font-mono text-6xl font-bold">404</div>

        {/* Message */}
        <h1 className="text-gh-fg-default mb-3 text-xl font-semibold">
          Authentication page not found
        </h1>
        <p className="text-gh-fg-muted mb-8 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist. Try signing in or creating a new
          account.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/auth/sign-in"
            className="bg-gh-accent-emphasis hover:bg-gh-accent-emphasis/90 inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium text-white transition-all"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Link>
          <Link
            href="/auth/sign-up"
            className="border-gh-border-default bg-gh-canvas-subtle text-gh-fg-default hover:border-gh-border-muted hover:bg-gh-canvas-inset inline-flex items-center justify-center gap-2 rounded-md border px-6 py-3 text-sm font-medium transition-all"
          >
            <UserPlus className="h-4 w-4" />
            Create Account
          </Link>
        </div>

        {/* Home link */}
        <div className="mt-8 flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="text-gh-fg-muted hover:text-gh-fg-default inline-flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <span className="text-gh-border-muted">•</span>
          <Link
            href="javascript:history.back()"
            className="text-gh-fg-muted hover:text-gh-fg-default inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Link>
        </div>
      </div>
    </div>
  );
}
