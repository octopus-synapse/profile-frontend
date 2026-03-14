'use client';

import { ArrowLeft, Code2, LayoutDashboard, ShieldAlert, Users } from 'lucide-react';
import Link from 'next/link';

/**
 * Admin 404 Not Found Page
 * Developer-inspired design with code aesthetic
 */
export default function AdminNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#030303] px-4">
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="flex h-24 w-24 items-center justify-center border border-white/10 bg-white/5">
            <ShieldAlert className="h-12 w-12 text-zinc-400" strokeWidth={1.5} />
          </div>
          <div className="bg-pf-danger-fg absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full" />
        </div>

        {/* Badge + Error Code */}
        <div className="mb-4 flex items-center gap-3">
          <span className="dev-badge text-[10px]">
            <span className="text-code-number">●</span> admin
          </span>
          <span className="font-mono text-8xl font-bold tracking-tighter text-white">404</span>
        </div>

        {/* Message */}
        <h1 className="mb-3 text-xl font-semibold text-white">admin_page_not_found</h1>
        <p className="mb-8 max-w-md font-mono text-sm text-zinc-400">
          This admin resource doesn&apos;t exist or you may not have permission to access it.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/protected/admin"
            className="inline-flex items-center justify-center gap-2 bg-white px-6 py-3 font-mono text-sm text-black transition-opacity hover:opacity-90"
          >
            <LayoutDashboard className="h-4 w-4" strokeWidth={1.5} />
            admin.dashboard()
          </Link>
          <Link
            href="/protected/admin/users"
            className="inline-flex items-center justify-center gap-2 border border-white/10 bg-transparent px-6 py-3 font-mono text-sm text-white transition-colors hover:bg-white/5"
          >
            <Users className="h-4 w-4" strokeWidth={1.5} />
            admin.users()
          </Link>
        </div>

        {/* Quick Navigation */}
        <div className="mt-10 border border-white/10 bg-[#0A0A0A]/95 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Code2 className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
            <span className="font-mono text-xs text-zinc-400">{'//'} quick_navigation</span>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <Link
              href="/protected/admin"
              className="flex items-center gap-2 px-3 py-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LayoutDashboard className="h-3 w-3" strokeWidth={1.5} />
              dashboard
            </Link>
            <Link
              href="/protected/admin/users"
              className="flex items-center gap-2 px-3 py-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Users className="h-3 w-3" strokeWidth={1.5} />
              users
            </Link>
          </div>
        </div>

        {/* Back link */}
        <button
          type="button"
          onClick={() => history.back()}
          className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          go_back()
        </button>
      </div>
    </div>
  );
}
