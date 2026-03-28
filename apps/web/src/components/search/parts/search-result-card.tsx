/**
 * SearchResultCard — single search result display.
 */

import type { SearchResultItemDto } from '@profile/api-client';
import { MapPin } from 'lucide-react';

export function SearchResultCard({ result: r }: { result: SearchResultItemDto }) {
  const displayName = r.fullName || 'Unknown';
  const skills = r.skills ?? [];

  return (
    <div className="rounded-xl border border-white/10 bg-[#0A0A0A]/70 p-5 transition-colors hover:border-white/20">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 text-sm font-bold text-blue-300">
          {displayName.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-white">{displayName}</p>
          <p className="flex items-center gap-1 text-xs text-zinc-400">
            {r.jobTitle ?? r.summary}
            {r.location && (
              <>
                <MapPin className="ml-1 inline h-3 w-3" />
                {r.location}
              </>
            )}
          </p>
        </div>
      </div>
      {skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {skills.slice(0, 6).map((s: string) => (
            <span key={s} className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-400">
              {s}
            </span>
          ))}
          {skills.length > 6 && <span className="text-xs text-zinc-600">+{skills.length - 6}</span>}
        </div>
      )}
    </div>
  );
}

export function ResultSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-white/10 bg-[#0A0A0A]/70 p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-white/10" />
          <div className="h-3 w-1/2 rounded bg-white/10" />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-5 w-16 rounded-full bg-white/10" />
        ))}
      </div>
    </div>
  );
}
