'use client';

import { useT } from '@profile/i18n';
import { FileText, Users } from 'lucide-react';
import { cn } from '@/shared/utils';
import { FollowButton } from './follow-button';
import { useSocialStats } from './hooks/use-social';

// ============================================================================
// Types
// ============================================================================

interface ProfileCardProps {
  userId: string;
  name: string | null;
  username: string | null;
  photoURL: string | null;
  bio: string | null;
  /** Hide follow button when viewing own profile */
  isSelf?: boolean;
  className?: string;
}

// ============================================================================
// Subcomponents
// ============================================================================

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
      <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
      <span className="font-medium text-zinc-200">{value}</span>
      <span>{label}</span>
    </div>
  );
}

function AvatarFallback({ name }: { name: string | null }) {
  const initial = name?.charAt(0)?.toUpperCase() ?? '?';
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/15 text-lg font-bold text-blue-300">
      {initial}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ProfileCard({
  userId,
  name,
  username,
  photoURL,
  bio,
  isSelf = false,
  className,
}: ProfileCardProps) {
  const t = useT();
  const { data: stats } = useSocialStats(userId);

  return (
    <div
      className={cn(
        'rounded-xl border border-white/10 bg-[#0A0A0A]/70 p-5',
        className,
      )}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        {photoURL ? (
          <img
            src={photoURL}
            alt={name ?? 'User avatar'}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-white/10"
          />
        ) : (
          <AvatarFallback name={name} />
        )}

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-white">
            {name ?? t('social.profile.anonymous')}
          </p>
          {username && (
            <p className="truncate text-sm text-zinc-400">@{username}</p>
          )}
          {bio && (
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-400">
              {bio}
            </p>
          )}
        </div>

        {/* Follow button */}
        {!isSelf && <FollowButton targetUserId={userId} />}
      </div>

      {/* Stats row */}
      {stats && (
        <div className="mt-4 flex gap-5 border-t border-white/5 pt-4">
          <StatItem icon={Users} label={t('social.profile.followers')} value={stats.followersCount} />
          <StatItem icon={Users} label={t('social.profile.following')} value={stats.followingCount} />
          <StatItem icon={FileText} label={t('social.profile.resumes')} value={stats.resumeCount} />
        </div>
      )}
    </div>
  );
}
