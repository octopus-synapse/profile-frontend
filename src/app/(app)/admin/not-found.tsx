"use client";

import Link from "next/link";
import { ShieldAlert, LayoutDashboard, ArrowLeft, Users, Code2 } from "lucide-react";

/**
 * Admin 404 Not Found Page
 * Developer-inspired design with code aesthetic
 */
export default function AdminNotFound() {
  return (
    <div className="bg-pf-canvas-default flex min-h-screen flex-col items-center justify-center px-4">
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="border-pf-border-default bg-pf-canvas-subtle flex h-24 w-24 items-center justify-center border">
            <ShieldAlert className="text-pf-fg-muted h-12 w-12" strokeWidth={1.5} />
          </div>
          <div className="bg-pf-danger-fg absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full" />
        </div>

        {/* Badge + Error Code */}
        <div className="mb-4 flex items-center gap-3">
          <span className="dev-badge text-[10px]">
            <span className="text-code-number">●</span> admin
          </span>
          <span className="text-pf-fg-default font-mono text-8xl font-bold tracking-tighter">
            404
          </span>
        </div>

        {/* Message */}
        <h1 className="text-pf-fg-default mb-3 text-xl font-semibold">
          admin_page_not_found
        </h1>
        <p className="text-pf-fg-muted mb-8 max-w-md font-mono text-sm">
          This admin resource doesn&apos;t exist or you may not have permission to access it.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin"
            className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm transition-opacity hover:opacity-90"
          >
            <LayoutDashboard className="h-4 w-4" strokeWidth={1.5} />
            admin.dashboard()
          </Link>
          <Link
            href="/admin/users"
            className="border-pf-border-default text-pf-fg-default hover:bg-pf-canvas-subtle inline-flex items-center justify-center gap-2 border bg-transparent px-6 py-3 font-mono text-sm transition-colors"
          >
            <Users className="h-4 w-4" strokeWidth={1.5} />
            admin.users()
          </Link>
        </div>

        {/* Quick Navigation */}
        <div className="border-pf-border-default bg-pf-canvas-overlay mt-10 border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Code2 className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
            <span className="text-pf-fg-muted font-mono text-xs">// quick_navigation</span>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <Link
              href="/admin"
              className="text-pf-fg-muted hover:bg-pf-canvas-subtle hover:text-pf-fg-default flex items-center gap-2 px-3 py-2 transition-colors"
            >
              <LayoutDashboard className="h-3 w-3" strokeWidth={1.5} />
              dashboard
            </Link>
            <Link
              href="/admin/users"
              className="text-pf-fg-muted hover:bg-pf-canvas-subtle hover:text-pf-fg-default flex items-center gap-2 px-3 py-2 transition-colors"
            >
              <Users className="h-3 w-3" strokeWidth={1.5} />
              users
            </Link>
          </div>
        </div>

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
