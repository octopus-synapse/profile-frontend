/**
 * SearchResultCard — search result display components.
 */

import type { SearchResultItemDto } from '@profile/api-client';
import { Eye, MapPin } from 'lucide-react';
import Link from 'next/link';

/** List-style result card for search results */
export function SearchResultCard({ result: r }: { result: SearchResultItemDto }) {
  const displayName = r.fullName || 'Unknown';
  const skills = r.skills ?? [];

  return (
    <Link
      href={`/u/${r.slug ?? r.userId}`}
      className="block rounded-xl border border-white/10 bg-[#0A0A0A]/70 p-5 transition-all hover:border-white/20 hover:bg-[#0A0A0A]"
    >
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
    </Link>
  );
}

/** Card-style profile for discovery grid */
export function ProfileCard({ result: r }: { result: SearchResultItemDto }) {
  const displayName = r.fullName || 'Unknown';
  const skills = r.skills ?? [];
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Generate a consistent color based on name
  const colors = [
    'from-blue-500/20 to-cyan-500/20 text-blue-300',
    'from-purple-500/20 to-pink-500/20 text-purple-300',
    'from-emerald-500/20 to-teal-500/20 text-emerald-300',
    'from-orange-500/20 to-amber-500/20 text-orange-300',
    'from-rose-500/20 to-red-500/20 text-rose-300',
  ];
  const colorIndex = displayName.charCodeAt(0) % colors.length;
  const colorClass = colors[colorIndex];

  return (
    <Link
      href={`/u/${r.slug ?? r.userId}`}
      className="group flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-[#0A0A0A] to-[#050505] p-5 transition-all hover:border-white/20 hover:shadow-lg hover:shadow-white/5"
    >
      {/* Avatar */}
      <div className="mb-4 flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${colorClass} text-lg font-bold`}
        >
          {initials}
        </div>
        {r.profileViews > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-xs text-zinc-500">
            <Eye className="h-3 w-3" />
            {r.profileViews}
          </div>
        )}
      </div>

      {/* Name & Title */}
      <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
        {displayName}
      </h3>
      {r.jobTitle && <p className="mt-0.5 text-sm text-zinc-400 line-clamp-1">{r.jobTitle}</p>}

      {/* Location */}
      {r.location && (
        <p className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
          <MapPin className="h-3 w-3" />
          {r.location}
        </p>
      )}

      {/* Summary */}
      {r.summary && <p className="mt-3 text-sm text-zinc-500 line-clamp-2">{r.summary}</p>}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
          {skills.slice(0, 4).map((s: string) => (
            <span key={s} className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-400">
              {s}
            </span>
          ))}
          {skills.length > 4 && <span className="text-xs text-zinc-600">+{skills.length - 4}</span>}
        </div>
      )}
    </Link>
  );
}

export function ResultSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/10 bg-[#0A0A0A]/70 p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="h-14 w-14 rounded-xl bg-white/10" />
        <div className="h-5 w-12 rounded-full bg-white/10" />
      </div>
      <div className="space-y-2">
        <div className="h-5 w-2/3 rounded bg-white/10" />
        <div className="h-4 w-1/2 rounded bg-white/10" />
      </div>
      <div className="mt-4 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-5 w-16 rounded-full bg-white/10" />
        ))}
      </div>
    </div>
  );
}
