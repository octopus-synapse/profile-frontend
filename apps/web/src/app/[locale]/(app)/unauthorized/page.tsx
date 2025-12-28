/**
 * Unauthorized Page
 * Developer-inspired design with code aesthetic
 */

import { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { ShieldX, Home, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Unauthorized | ProFile",
  description: "You don't have permission to access this resource",
};

export default function UnauthorizedPage() {
  return (
    <div className="bg-pf-canvas-default flex min-h-screen flex-col items-center justify-center px-4">
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="border-pf-border-default bg-pf-canvas-subtle flex h-24 w-24 items-center justify-center border">
            <ShieldX className="text-pf-fg-muted h-12 w-12" strokeWidth={1.5} />
          </div>
          {/* Status indicator */}
          <div className="bg-pf-danger-fg absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full" />
        </div>

        {/* Error Code */}
        <div className="text-pf-fg-default mb-4 font-mono text-8xl font-bold tracking-tighter">
          403
        </div>

        {/* Message */}
        <h1 className="text-pf-fg-default mb-3 text-xl font-semibold">Access Denied</h1>
        <p className="text-pf-fg-muted mb-8 max-w-md font-mono text-sm">
          You don&apos;t have permission to access this page. Please contact an administrator if you
          believe this is an error.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={ROUTES.HOME}
            className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm transition-opacity hover:opacity-90"
          >
            <Home className="h-4 w-4" strokeWidth={1.5} />
            go_home()
          </Link>
          <Link
            href={ROUTES.AUTH.SIGN_IN}
            className="border-pf-border-default text-pf-fg-default hover:bg-pf-canvas-subtle inline-flex items-center justify-center gap-2 border bg-transparent px-6 py-3 font-mono text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            try_different_account()
          </Link>
        </div>

        {/* Decorative code block */}
        <div className="code-block mt-8 w-full max-w-sm">
          <div className="code-block-header">
            <div className="code-block-dots">
              <span className="code-block-dot red" />
              <span className="code-block-dot yellow" />
              <span className="code-block-dot green" />
            </div>
            <span className="code-block-title">auth.ts</span>
          </div>
          <div className="code-block-content text-left">
            <div>
              <span className="code-keyword">const</span>{" "}
              <span className="code-variable">response</span> = {"{"}
            </div>
            <div className="ml-4">
              <span className="code-function">status</span>:{" "}
              <span className="code-number">403</span>,
            </div>
            <div className="ml-4">
              <span className="code-function">error</span>:{" "}
              <span className="code-string">&quot;FORBIDDEN&quot;</span>,
            </div>
            <div className="ml-4">
              <span className="code-function">message</span>:{" "}
              <span className="code-string">&quot;Access denied&quot;</span>
            </div>
            <div>{"}"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
