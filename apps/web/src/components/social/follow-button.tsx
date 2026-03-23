'use client';

import { useT } from '@profile/i18n';
import { Loader2, UserMinus, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/utils';
import {
  useFollowUser,
  useIsFollowing,
  useUnfollowUser,
} from './hooks/use-social';

// ============================================================================
// Types
// ============================================================================

interface FollowButtonProps {
  targetUserId: string;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function FollowButton({ targetUserId, className }: FollowButtonProps) {
  const t = useT();
  const { data, isLoading: isChecking } = useIsFollowing(targetUserId);
  const follow = useFollowUser();
  const unfollow = useUnfollowUser();
  const [hovered, setHovered] = useState(false);

  const isFollowing = data?.isFollowing ?? false;
  const isBusy = follow.isPending || unfollow.isPending;

  const handleClick = () => {
    if (isBusy) return;
    if (isFollowing) {
      unfollow.mutate(targetUserId);
    } else {
      follow.mutate(targetUserId);
    }
  };

  // While checking follow status, show a neutral placeholder
  if (isChecking) {
    return (
      <div
        className={cn(
          'flex h-9 w-24 items-center justify-center rounded-lg border border-white/10 bg-white/5',
          className,
        )}
      >
        <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
      </div>
    );
  }

  const showUnfollow = isFollowing && hovered;

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={isBusy}
      className={cn(
        'flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-medium transition-all',
        isFollowing
          ? showUnfollow
            ? 'border border-red-500/40 bg-red-500/10 text-red-400'
            : 'border border-white/10 bg-white/5 text-zinc-300'
          : 'bg-blue-600 text-white hover:bg-blue-500',
        isBusy && 'pointer-events-none opacity-60',
        className,
      )}
    >
      {isBusy ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : showUnfollow ? (
        <UserMinus className="h-3.5 w-3.5" strokeWidth={1.5} />
      ) : !isFollowing ? (
        <UserPlus className="h-3.5 w-3.5" strokeWidth={1.5} />
      ) : null}

      {isBusy
        ? t('action.loading')
        : showUnfollow
          ? t('social.follow.unfollow')
          : isFollowing
            ? t('social.follow.following')
            : t('social.follow.follow')}
    </button>
  );
}
