'use client';

import { Button } from '@octopus-synapse/profile-ui';
import { ArrowLeft, FileText, FileX, Home, Settings, User } from 'lucide-react';
import Link from 'next/link';

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
          <div className="flex h-24 w-24 items-center justify-center border border-white/10 bg-white/5">
            <FileX className="h-12 w-12 text-zinc-400" strokeWidth={1.5} />
          </div>
          <div className="bg-amber-500 absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full" />
        </div>

        {/* Error Code */}
        <div className="mb-4 font-mono text-8xl font-bold tracking-tighter text-white">404</div>

        {/* Message */}
        <h1 className="mb-3 text-xl font-semibold text-white">page_not_found</h1>
        <p className="mb-8 max-w-md font-mono text-sm text-zinc-400">
          We couldn&apos;t find the page you&apos;re looking for. It might have been moved or
          deleted.
        </p>

        {/* Quick links */}
        <div className="mb-8 grid w-full max-w-md grid-cols-2 gap-3">
          <Link
            href="/protected/profile"
            className="hover:border-white/20 flex items-center justify-center gap-2 border border-white/10 bg-[#0A0A0A]/95 px-4 py-3 font-mono text-xs text-white transition-all"
          >
            <User className="h-4 w-4" strokeWidth={1.5} />
            profile
          </Link>
          <Link
            href="/protected/resume"
            className="hover:border-white/20 flex items-center justify-center gap-2 border border-white/10 bg-[#0A0A0A]/95 px-4 py-3 font-mono text-xs text-white transition-all"
          >
            <FileText className="h-4 w-4" strokeWidth={1.5} />
            resume
          </Link>
          <Link
            href="/protected"
            className="hover:border-white/20 flex items-center justify-center gap-2 border border-white/10 bg-[#0A0A0A]/95 px-4 py-3 font-mono text-xs text-white transition-all"
          >
            <Home className="h-4 w-4" strokeWidth={1.5} />
            dashboard
          </Link>
          <Link
            href="/protected/settings"
            className="hover:border-white/20 flex items-center justify-center gap-2 border border-white/10 bg-[#0A0A0A]/95 px-4 py-3 font-mono text-xs text-white transition-all"
          >
            <Settings className="h-4 w-4" strokeWidth={1.5} />
            settings
          </Link>
        </div>

        {/* Primary action */}
        <Link
          href="/protected"
          className="inline-flex items-center justify-center gap-2 bg-white px-6 py-3 font-mono text-sm text-black transition-opacity hover:opacity-90"
        >
          <Home className="h-4 w-4" strokeWidth={1.5} />
          go_to_dashboard()
        </Link>

        {/* Back link */}
        <span className="mt-6 block">
          <Button
            type="button"
            variant="ghost"
            tone="neutral"
            size="xs"
            leftIcon={<ArrowLeft className="h-3 w-3" strokeWidth={1.5} />}
            onPress={() => history.back()}
          >
            go_back()
          </Button>
        </span>
      </div>
    </div>
  );
}
