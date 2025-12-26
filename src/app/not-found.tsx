import Link from "next/link";
import { FileQuestion, Home, ArrowLeft, Search } from "lucide-react";

/**
 * Global 404 Not Found Page
 * GitHub/Cursor-inspired design with animated elements
 */
export default function NotFound() {
  return (
    <div className="bg-gh-canvas-default flex min-h-screen flex-col items-center justify-center px-4">
      {/* Background gradient effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="from-gh-accent-emphasis/10 absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b to-transparent blur-3xl" />
        <div className="from-gh-success-emphasis/5 absolute -bottom-1/2 left-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-t to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Animated 404 Icon */}
        <div className="relative mb-8">
          <div className="border-gh-border-default bg-gh-canvas-subtle flex h-32 w-32 items-center justify-center rounded-full border">
            <FileQuestion className="text-gh-fg-muted h-16 w-16 animate-pulse" />
          </div>
          {/* Floating particles */}
          <div
            className="bg-gh-accent-emphasis/50 absolute top-0 -right-4 h-3 w-3 animate-bounce rounded-full"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="bg-gh-success-emphasis/50 absolute top-8 -left-2 h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: "0.3s" }}
          />
          <div
            className="bg-gh-attention-emphasis/50 absolute right-4 -bottom-2 h-2.5 w-2.5 animate-bounce rounded-full"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        {/* 404 Number */}
        <div className="mb-4 font-mono text-8xl font-bold tracking-tighter">
          <span className="from-gh-fg-default via-gh-accent-fg to-gh-fg-muted bg-gradient-to-r bg-clip-text text-transparent">
            404
          </span>
        </div>

        {/* Message */}
        <h1 className="text-gh-fg-default mb-3 text-2xl font-semibold">Page not found</h1>
        <p className="text-gh-fg-muted mb-8 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Check the URL or
          navigate back to safety.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="bg-gh-accent-emphasis hover:bg-gh-accent-emphasis/90 focus:ring-gh-accent-emphasis focus:ring-offset-gh-canvas-default inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium text-white transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <Link
            href="javascript:history.back()"
            className="border-gh-border-default bg-gh-canvas-subtle text-gh-fg-default hover:bg-gh-canvas-inset hover:border-gh-border-muted focus:ring-gh-accent-emphasis focus:ring-offset-gh-canvas-default inline-flex items-center justify-center gap-2 rounded-md border px-6 py-3 text-sm font-medium transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Link>
        </div>

        {/* Help text */}
        <div className="text-gh-fg-muted mt-12 flex items-center gap-2 text-sm">
          <Search className="h-4 w-4" />
          <span>
            Looking for something specific?{" "}
            <Link href="/auth/sign-in" className="text-gh-accent-fg hover:underline">
              Sign in
            </Link>{" "}
            to access your profile.
          </span>
        </div>

        {/* Decorative code block */}
        <div className="border-gh-border-default bg-gh-canvas-subtle mt-8 w-full max-w-sm overflow-hidden rounded-lg border">
          <div className="border-gh-border-muted flex items-center gap-2 border-b px-4 py-2">
            <span className="bg-gh-danger-emphasis/60 h-3 w-3 rounded-full" />
            <span className="bg-gh-attention-emphasis/60 h-3 w-3 rounded-full" />
            <span className="bg-gh-success-emphasis/60 h-3 w-3 rounded-full" />
            <span className="text-gh-fg-muted ml-2 font-mono text-xs">response.ts</span>
          </div>
          <div className="p-4 font-mono text-xs">
            <div className="text-gh-fg-muted">
              <span className="text-gh-accent-fg">const</span>{" "}
              <span className="text-gh-success-fg">response</span>{" "}
              <span className="text-gh-fg-muted">=</span>{" "}
              <span className="text-gh-fg-muted">{"{"}</span>
            </div>
            <div className="text-gh-fg-muted ml-4">
              <span className="text-gh-attention-fg">status</span>
              <span className="text-gh-fg-muted">:</span>{" "}
              <span className="text-gh-danger-fg">404</span>
              <span className="text-gh-fg-muted">,</span>
            </div>
            <div className="text-gh-fg-muted ml-4">
              <span className="text-gh-attention-fg">message</span>
              <span className="text-gh-fg-muted">:</span>{" "}
              <span className="text-gh-success-fg">&quot;Not Found&quot;</span>
            </div>
            <div className="text-gh-fg-muted">{"};"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
